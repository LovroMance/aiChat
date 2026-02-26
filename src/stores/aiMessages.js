import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { addData, getDataByIndex, putData, AI_MESSAGES_STORE } from '@/utils/indexedDB'

export const useAiMessagesStore = defineStore('aiMessages', () => {
  const currentThreadId = ref(null)
  const messagesByThread = ref(new Map())
  const version = ref(0)
  const STREAM_PERSIST_INTERVAL = 800
  const streamPersistTimers = new Map()

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
      const plain = JSON.parse(JSON.stringify(toRaw(message)))
      await addData(AI_MESSAGES_STORE, plain)
    } catch (error) {
      console.error('保存 AI 消息失败:', error)
    }
  }

  const scheduleStreamPersist = (threadId, messageId) => {
    if (!threadId || !messageId) return
    if (streamPersistTimers.has(messageId)) return

    const timer = setTimeout(async () => {
      streamPersistTimers.delete(messageId)
      const bucket = ensureBucket(threadId)
      if (!bucket) return
      const latest = bucket.find((item) => item.message_id === messageId)
      if (!latest) return
      try {
        const plain = JSON.parse(JSON.stringify(toRaw(latest)))
        await putData(AI_MESSAGES_STORE, plain)
      } catch (error) {
        console.error('保存 AI 流式快照失败:', error)
      }
    }, STREAM_PERSIST_INTERVAL)

    streamPersistTimers.set(messageId, timer)
  }

  const clearStreamPersistTimer = (messageId) => {
    const timer = streamPersistTimers.get(messageId)
    if (timer) {
      clearTimeout(timer)
      streamPersistTimers.delete(messageId)
    }
  }

  const upsertStreamingMessage = (threadId, requestId, message) => {
    if (!threadId || !requestId || !message) return
    const bucket = ensureBucket(threadId)
    if (!bucket) return
    const index = bucket.findIndex((item) => item.message_id === message.message_id)
    if (index > -1) {
      const prev = bucket[index]
      const nextContent = `${prev.content ?? ''}${message.content ?? ''}`
      const nextReasoning = `${prev.reasoning_content ?? ''}${message.reasoning_content ?? ''}`
      bucket.splice(index, 1, {
        ...prev,
        ...message,
        content: nextContent,
        reasoning_content: nextReasoning,
        time: prev.time ?? message.time,
        status: message.status ?? prev.status,
      })
    } else {
      bucket.push(message)
    }
    version.value++
    scheduleStreamPersist(threadId, message.message_id)
  }

  const finalizeStreamMessage = async (threadId, message) => {
    if (!threadId || !message) return
    const bucket = ensureBucket(threadId)
    if (!bucket) return

    const streamIndex = bucket.findIndex(
      (item) =>
        item.message_id === message.message_id ||
        (message.message_id && item.request_id === message.message_id),
    )

    if (streamIndex > -1) {
      const prev = bucket[streamIndex]
      bucket.splice(streamIndex, 1, { ...prev, ...message })
    } else {
      bucket.push(message)
    }

    version.value++
    clearStreamPersistTimer(message.message_id)

    try {
      const plain = JSON.parse(JSON.stringify(toRaw(message)))
      await putData(AI_MESSAGES_STORE, plain)
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
    const list = ensureBucket(currentThreadId.value) || []
    return [...list].sort((a, b) => {
      const aTime = typeof a.time_ts === 'number' ? a.time_ts : 0
      const bTime = typeof b.time_ts === 'number' ? b.time_ts : 0
      return aTime - bTime
    })
  })

  return {
    currentThreadId,
    currentMessages,
    setCurrentThreadId,
    setThreadMessages,
    addThreadMessage,
    upsertStreamingMessage,
    finalizeStreamMessage,
    loadThreadMessages,
  }
})
