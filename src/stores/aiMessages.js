import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addData, getDataByIndex, AI_MESSAGES_STORE } from '@/utils/indexedDB'

export const useAiMessagesStore = defineStore('aiMessages', () => {
  const currentThreadId = ref(null)
  const messagesByThread = ref(new Map())
  const version = ref(0)

  const ensureBucket = (threadId) => {
    if (!threadId) return null
    if (!messagesByThread.value.has(threadId)) {
      messagesByThread.value.set(threadId, [])
    }
    return messagesByThread.value.get(threadId)
  }

  const setCurrentThreadId = (threadId) => {
    currentThreadId.value = threadId || null
  }

  const setThreadMessages = (threadId, list) => {
    if (!threadId) return
    messagesByThread.value.set(threadId, Array.isArray(list) ? [...list] : [])
    version.value++
  }

  const addThreadMessage = async (threadId, message) => {
    if (!threadId || !message) return
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    bucket.push(message)
    version.value++
    try {
      await addData(AI_MESSAGES_STORE, message)
    } catch (error) {
      console.error('保存 AI 消息失败:', error)
    }
  }

  const loadThreadMessages = async (threadId) => {
    if (!threadId) return
    try {
      const list = await getDataByIndex(AI_MESSAGES_STORE, 'thread_id', threadId)
      setThreadMessages(threadId, list)
    } catch (error) {
      console.error('加载 AI 消息失败:', error)
      setThreadMessages(threadId, [])
    }
  }

  const currentMessages = computed(() => {
    version.value
    if (!currentThreadId.value) return []
    return ensureBucket(currentThreadId.value) || []
  })

  return {
    currentThreadId,
    currentMessages,
    setCurrentThreadId,
    setThreadMessages,
    addThreadMessage,
    loadThreadMessages,
  }
})
