import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UNREAD_MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useUnreadMessagesStore = defineStore('unreadMessages', () => {
  const unreadMessagesMap = ref(new Map())
  const unreadMsgId = ref(0)  // 避免重复添加未读消息数

  const sortedUnreadMessagesMap = computed(() => {
    // 1. 将 Map 转换为数组
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
    unreadMessagesMap.value.set(threadId, messageData)
  }

  // 从 IndexedDB 加载
  const loadUnreadMessagesFromDB = async () => {
    try {
      const unreadMessages = await getAllData(UNREAD_MESSAGES_STORE)
      unreadMessagesMap.value.clear()
      unreadMessages.forEach((message) => {
        unreadMessagesMap.value.set(message.thread_id, message)
      })
      console.log('加载本地数据unreadMessages完成', unreadMessagesMap.value)
    } catch (error) {
      console.error('从 IndexedDB 加载未读消息失败:', error)
      throw error
    }
  }

  return {
    unreadMessagesMap,
    unreadMsgId,
    sortedUnreadMessagesMap,
    loadUnreadMessagesFromDB,
    updateUnreadMessage,
  }
})
