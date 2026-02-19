import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UNREAD_MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useUnreadMessagesStore = defineStore('unreadMessages', () => {
  const unreadMessagesMap = ref(new Map())
  const unreadMsgId = ref(0) // 避免重复添加未读消息数
  const version = ref(0) // Map 原位变更的响应触发

  const setMap = (map) => {
    unreadMessagesMap.value = map
    version.value++
  }

  const upsert = (threadId, record) => {
    if (!threadId || !record) return
    const next = new Map(unreadMessagesMap.value)
    next.set(threadId, record)
    setMap(next)
  }

  const remove = (threadId) => {
    if (!threadId) return
    if (!unreadMessagesMap.value.has(threadId)) return
    const next = new Map(unreadMessagesMap.value)
    next.delete(threadId)
    setMap(next)
  }

  const sortedUnreadMessagesMap = computed(() => {
    // 1. 将 Map 转换为数组
    version.value // 依赖版本，保证 Map 变更触发
    const chatArray = Array.from(unreadMessagesMap.value.values())
    // 2. 对数组进行排序
    chatArray.sort((a, b) => {
      // b.lastTime - a.lastTime 实现降序排列（时间戳大的在前面）
      return b.lastTime - a.lastTime
    })
    // 3. 返回排序后的数组
    return chatArray
  })

  // 更新未读消息
  const updateUnreadMessage = (threadId, messageData) => {
    upsert(threadId, messageData)
  }

  const getUnreadRecord = (threadId) => unreadMessagesMap.value.get(threadId) || null

  const markThreadAsRead = (threadId) => {
    const exist = getUnreadRecord(threadId)
    if (!exist) return null
    const next = { ...exist, unreadCount: 0 }
    upsert(threadId, next)
    return next
  }

  const clearThread = (threadId) => {
    remove(threadId)
  }

  // 从 IndexedDB 加载
  const loadUnreadMessagesFromDB = async () => {
    try {
      const unreadMessages = await getAllData(UNREAD_MESSAGES_STORE)
      const next = new Map()
      unreadMessages.forEach((message) => {
        next.set(message.thread_id, message)
      })
      setMap(next)
      console.log('加载本地数据unreadMessages完成', next)
    } catch (error) {
      console.error('从 IndexedDB 加载未读消息失败:', error)
      throw error
    }
  }

  return {
    unreadMessagesMap,
    unreadMsgId,
    version,
    sortedUnreadMessagesMap,
    loadUnreadMessagesFromDB,
    updateUnreadMessage,
    getUnreadRecord,
    markThreadAsRead,
    clearThread,
  }
})
