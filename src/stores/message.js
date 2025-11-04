import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useMessageStore = defineStore('message', () => {
  const receiveMessages = ref([])

  const addMessage = (message) => {
    receiveMessages.value.push(message)
  }

  const clearMessage = () => {
    receiveMessages.value = []
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
      receiveMessages.value = []

      // 将数据加载到数组中
      receiveMessages.value.push(...messages)

      console.log(`成功加载 ${messages.length} 条消息到 store 中`)
      console.log('receiveMessages:', receiveMessages.value)

      return messages
    } catch (error) {
      console.error('从 IndexedDB 加载消息失败:', error)
      throw error
    }
  }

  return {
    receiveMessages,
    addMessage,
    clearMessage,
    loadMessagesFromDB,
  }
})
