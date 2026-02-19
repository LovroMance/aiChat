import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThreadStore } from '@/stores/thread'

export const useMessageStore = defineStore('message', () => {
  const messagesByThread = ref(new Map()) // thread_id -> { before:[], offline:[], online:[] }
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
    beforeMessages,
    offlineMessages,
    onlineMessages,
    resetThread,
    resetAll,
    setHistory,
    appendOffline,
    addOnline,
    getThreadMessages,
  }
})
