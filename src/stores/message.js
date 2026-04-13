import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThreadStore } from '@/stores/thread'

const LOCAL_HISTORY_PAGE_SIZE = 30
const REMOTE_HISTORY_PAGE_SIZE = 20

// 每个会话单独维护一份消息分层与分页状态，避免不同 thread 互相污染。
const createBucket = () => ({
  localHistory: [],
  offline: [],
  online: [],
  visibleLocalCount: LOCAL_HISTORY_PAGE_SIZE,
  initialized: false,
  loadingInitial: false,
  syncingOffline: false,
  offlineSynced: false,
})

const normalizeMessageId = (message) => {
  const rawId = message?.message_id
  if (rawId === null || rawId === undefined) return Number.NEGATIVE_INFINITY
  const numberId = Number(rawId)
  if (!Number.isNaN(numberId)) return numberId

  if (typeof rawId === 'string' && rawId.startsWith('local-')) {
    const localTimestamp = Number(rawId.split('-')[1])
    if (!Number.isNaN(localTimestamp)) {
      return localTimestamp
    }
  }

  return Number.NEGATIVE_INFINITY
}

const normalizeCreateTime = (message) => {
  const numberTime = Number(message?.create_time)
  return Number.isNaN(numberTime) ? Number.NEGATIVE_INFINITY : numberTime
}

const sortMessages = (list) => {
  return [...list].sort((left, right) => {
    const createTimeDiff = normalizeCreateTime(left) - normalizeCreateTime(right)
    if (createTimeDiff !== 0) return createTimeDiff
    return normalizeMessageId(left) - normalizeMessageId(right)
  })
}

const dedupeMessages = (list) => {
  const map = new Map()
  for (const item of list) {
    if (!item?.message_id) continue
    map.set(item.message_id, item)
  }
  return sortMessages(Array.from(map.values()))
}

export const useMessageStore = defineStore('message', () => {
  const messagesByThread = ref(new Map())
  const pendingQueue = ref([])
  const version = ref(0) // 手动触发依赖更新（Map 内部变更）
  const threadStore = useThreadStore()

  const ensureBucket = (threadId) => {
    if (!threadId) return null
    if (!messagesByThread.value.has(threadId)) {
      messagesByThread.value.set(threadId, createBucket())
    }
    return messagesByThread.value.get(threadId)
  }

  const resetThread = (threadId) => {
    if (!threadId) return
    messagesByThread.value.set(threadId, createBucket())
    version.value++
  }

  const resetAll = () => {
    messagesByThread.value.clear()
    version.value++
  }

  const setHistory = (threadId, list) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    // 首屏先接管本地历史，再只展示最近一段，后续上滑时继续展开更早本地消息。
    bucket.localHistory = dedupeMessages(Array.isArray(list) ? list : [])
    bucket.visibleLocalCount = LOCAL_HISTORY_PAGE_SIZE
    bucket.initialized = true
    version.value++
  }

  const appendOffline = (threadId, list) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    if (Array.isArray(list)) {
      // 离线消息按批次持续接在本地历史后面展示，并在进入 store 时去重。
      bucket.offline = dedupeMessages([...bucket.offline, ...list])
      version.value++
    }
  }

  const addOnline = (threadId, message) => {
    const bucket = ensureBucket(threadId)
    if (!bucket || !message) return
    bucket.online = dedupeMessages([...bucket.online, message])
    version.value++
  }

  const addLocalMessage = (threadId, message) => {
    addOnline(threadId, message)
  }

  const updateOnlineMessage = (threadId, matcher, patch) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return null

    const index = bucket.online.findIndex((item) =>
      typeof matcher === 'function' ? matcher(item) : item?.message_id === matcher,
    )
    if (index === -1) return null

    const current = bucket.online[index]
    bucket.online.splice(index, 1, {
      ...current,
      ...patch,
    })
    version.value++
    return bucket.online[index]
  }

  const enqueuePendingMessage = (item) => {
    if (!item?.client_message_id) return
    const index = pendingQueue.value.findIndex(
      (queueItem) => queueItem.client_message_id === item.client_message_id,
    )
    if (index > -1) {
      pendingQueue.value.splice(index, 1, item)
    } else {
      pendingQueue.value.push(item)
    }
  }

  const dequeuePendingMessage = (clientMessageId) => {
    if (!clientMessageId) return
    const index = pendingQueue.value.findIndex(
      (item) => item.client_message_id === clientMessageId,
    )
    if (index > -1) {
      pendingQueue.value.splice(index, 1)
    }
  }

  const getPendingMessage = (clientMessageId) => {
    return (
      pendingQueue.value.find((item) => item.client_message_id === clientMessageId) || null
    )
  }

  const getPendingQueue = () => {
    return [...pendingQueue.value]
  }

  const reconcileServerMessage = (message) => {
    if (!message?.thread_id) return false
    const bucket = ensureBucket(message.thread_id)
    if (!bucket) return false

    const index = bucket.online.findIndex(
      (item) =>
        item?.isLocal &&
        item.thread_id === message.thread_id &&
        item.sender_uid === message.sender_uid &&
        item.content === message.content,
    )

    if (index === -1) return false

    const localMessage = bucket.online[index]
    bucket.online.splice(index, 1, {
      ...message,
      delivery_status: 'sent',
      isLocal: false,
    })
    version.value++

    if (localMessage?.client_message_id) {
      dequeuePendingMessage(localMessage.client_message_id)
    }

    return true
  }

  const getThreadMessages = (threadId) => {
    return (
      ensureBucket(threadId) || {
        ...createBucket(),
      }
    )
  }

  const getVisibleLocalHistory = (threadId) => {
    const bucket = getThreadMessages(threadId)
    const startIndex = Math.max(bucket.localHistory.length - bucket.visibleLocalCount, 0)
    return bucket.localHistory.slice(startIndex)
  }

  const getHiddenLocalCount = (threadId) => {
    const bucket = getThreadMessages(threadId)
    return Math.max(bucket.localHistory.length - bucket.visibleLocalCount, 0)
  }

  const expandLocalHistory = (threadId, pageSize = LOCAL_HISTORY_PAGE_SIZE) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return { added: 0, done: true }

    // 触顶后只展开本地尚未展示的历史，不再向远端翻更早记录。
    const hiddenCount = getHiddenLocalCount(threadId)
    if (!hiddenCount) {
      return { added: 0, done: true }
    }

    const nextCount = Math.min(bucket.visibleLocalCount + pageSize, bucket.localHistory.length)
    const added = nextCount - bucket.visibleLocalCount
    bucket.visibleLocalCount = nextCount
    version.value++

    return {
      added,
      done: getHiddenLocalCount(threadId) === 0,
    }
  }

  const setInitialLoading = (threadId, value) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    bucket.loadingInitial = Boolean(value)
    version.value++
  }

  const setOfflineSyncing = (threadId, value) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    bucket.syncingOffline = Boolean(value)
    version.value++
  }

  const setOfflineSynced = (threadId, value) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    bucket.offlineSynced = Boolean(value)
    version.value++
  }

  const hasThreadInitialized = (threadId) => {
    return Boolean(messagesByThread.value.get(threadId)?.initialized)
  }

  const hasOfflineSynced = (threadId) => {
    return Boolean(messagesByThread.value.get(threadId)?.offlineSynced)
  }

  const getHistoryStatus = (threadId) => {
    const bucket = getThreadMessages(threadId)
    // 面板只消费这个聚合状态，不直接推断分页细节。
    return {
      hiddenLocalCount: getHiddenLocalCount(threadId),
      initialized: bucket.initialized,
      loadingInitial: bucket.loadingInitial,
      syncingOffline: bucket.syncingOffline,
      offlineSynced: bucket.offlineSynced,
      hasMoreHistory: getHiddenLocalCount(threadId) > 0,
    }
  }

  const activeThreadId = computed(() => threadStore.activeThreadId)

  const beforeMessages = computed(() => {
    version.value // 依赖版本，触发更新
    return getVisibleLocalHistory(activeThreadId.value)
  })

  const offlineMessages = computed(() => {
    version.value
    const bucket = getThreadMessages(activeThreadId.value)
    return bucket.offline
  })

  const onlineMessages = computed(() => {
    version.value
    const bucket = getThreadMessages(activeThreadId.value)
    return bucket.online
  })

  const historyStatus = computed(() => {
    version.value
    return getHistoryStatus(activeThreadId.value)
  })

  return {
    messagesByThread,
    pendingQueue,
    beforeMessages,
    offlineMessages,
    onlineMessages,
    historyStatus,
    resetThread,
    resetAll,
    setHistory,
    appendOffline,
    addOnline,
    addLocalMessage,
    updateOnlineMessage,
    enqueuePendingMessage,
    dequeuePendingMessage,
    getPendingMessage,
    getPendingQueue,
    reconcileServerMessage,
    getThreadMessages,
    expandLocalHistory,
    setInitialLoading,
    setOfflineSyncing,
    setOfflineSynced,
    hasThreadInitialized,
    hasOfflineSynced,
    getHistoryStatus,
    getHiddenLocalCount,
    LOCAL_HISTORY_PAGE_SIZE,
    REMOTE_HISTORY_PAGE_SIZE,
  }
})
