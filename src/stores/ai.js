import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllData, AI_THREADS_STORE } from '@/utils/indexedDB'

export const useAiStore = defineStore('ai', () => {
  const aiThreadId = ref(null) // 当前 AI 线程 id
  const aiThreads = ref([]) // AI 会话列表
  const messagesByThread = ref(new Map()) // thread_id -> { before:[], online:[] }
  const version = ref(0) // 手动触发依赖更新（Map 内部变更）

  const ensureBucket = (threadId) => {
    if (!threadId) return null
    if (!messagesByThread.value.has(threadId)) {
      messagesByThread.value.set(threadId, { before: [], online: [] })
    }
    return messagesByThread.value.get(threadId)
  }

  const setAiThreadId = (threadId) => {
    aiThreadId.value = threadId || null
  }

  const resetThread = (threadId) => {
    if (!threadId) return
    messagesByThread.value.set(threadId, { before: [], online: [] })
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

  const addOnline = (threadId, message) => {
    const bucket = ensureBucket(threadId)
    if (!bucket || !message) return
    bucket.online.push(message)
    version.value++
  }

  const getThreadMessages = (threadId) => {
    return ensureBucket(threadId) || { before: [], online: [] }
  }

  const loadAiThreads = async () => {
    try {
      const threads = await getAllData(AI_THREADS_STORE)
      aiThreads.value = Array.isArray(threads) ? threads : []
    } catch (error) {
      console.error('加载 AI 会话失败:', error)
      aiThreads.value = []
    }
  }

  const upsertAiThread = (thread) => {
    if (!thread?.thread_id) return
    const index = aiThreads.value.findIndex((item) => item.thread_id === thread.thread_id)
    if (index > -1) {
      aiThreads.value.splice(index, 1, { ...aiThreads.value[index], ...thread })
      return
    }
    aiThreads.value.unshift(thread)
  }

  const beforeMessages = computed(() => {
    version.value
    const bucket = getThreadMessages(aiThreadId.value)
    return bucket.before
  })

  const onlineMessages = computed(() => {
    version.value
    const bucket = getThreadMessages(aiThreadId.value)
    return bucket.online
  })

  return {
    aiThreadId,
    messagesByThread,
    beforeMessages,
    onlineMessages,
    aiThreads,
    setAiThreadId,
    resetThread,
    resetAll,
    setHistory,
    addOnline,
    getThreadMessages,
    loadAiThreads,
    upsertAiThread,
  }
})
