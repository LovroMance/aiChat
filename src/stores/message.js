import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useMessageStore = defineStore('message', () => {
  const beforeMessages = ref([])  // 过去聊天信息
  const offlineMessages = ref([])  // 离线聊天信息
  const onlineMessages = ref([])   // 在线聊天信息

  const addMessage = (message) => {
    onlineMessages.value.push(message)
  }

  const clearMessage = () => {
    beforeMessages.value = []
  }

  /**
   * 从 IndexedDB 加载消息到 store 中
   */
  const loadMessagesFromDB = async () => {
    try {
      console.log('正在从 IndexedDB 加载消息...')

      // 获取所有消息数据
      const messages = await getAllData(MESSAGES_STORE)

      // 清空现有的消息数组
      beforeMessages.value = []

      // 将数据加载到数组中
      beforeMessages.value.push(...messages)

      console.log(`成功加载 ${messages.length} 条消息到 store 中`)
      console.log('beforeMessages:', beforeMessages.value)

      return messages
    } catch (error) {
      console.error('从 IndexedDB 加载消息失败:', error)
      throw error
    }
  }

  return {
    beforeMessages,
    offlineMessages,
    onlineMessages,
    addMessage,
    clearMessage,
    loadMessagesFromDB,
  }
})
