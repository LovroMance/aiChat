import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThreadStore } from '@/stores/thread'

export const useMessageStore = defineStore('message', () => {
  const messagesByThread = ref(new Map()) // thread_id -> { before:[], offline:[], online:[] }
  const pendingQueue = ref([])
  const version = ref(0) // 手动触发依赖更新（Map 内部变更）
  const threadStore = useThreadStore()

  const ensureBucket = (threadId) => {
    if (!threadId) return null
    if (!messagesByThread.value.has(threadId)) {
      messagesByThread.value.set(threadId, { before: [], offline: [], online: [] })
    }
    return messagesByThread.value.get(threadId)
  }

  const resetThread = (threadId) => {
    if (!threadId) return
    messagesByThread.value.set(threadId, { before: [], offline: [], online: [] })
    version.value++
  }

  const resetAll = () => {
    messagesByThread.value.clear()
    version.value++
  }

  const setHistory = (threadId, list) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    bucket.before = Array.isArray(list) ? [...list] : []
    version.value++
  }

  const appendOffline = (threadId, list) => {
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    if (Array.isArray(list)) {
      bucket.offline.push(...list)
      version.value++
    }
  }

  const addOnline = (threadId, message) => {
    const bucket = ensureBucket(threadId)
    if (!bucket || !message) return
    bucket.online.push(message)
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
    return ensureBucket(threadId) || { before: [], offline: [], online: [] }
  }

  const activeThreadId = computed(() => threadStore.activeThreadId)

  const beforeMessages = computed(() => {
    version.value // 依赖版本，触发更新
    const bucket = getThreadMessages(activeThreadId.value)
    return bucket.before
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

  return {
    messagesByThread,
    pendingQueue,
    beforeMessages,
    offlineMessages,
    onlineMessages,
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
  }
})
