import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore('message', () => {
  const beforeMessages = ref([]) // 过去聊天信息
  const offlineMessages = ref([]) // 离线聊天信息
  const onlineMessages = ref([]) // 在线聊天信息

  const addOnlineMessage = (message) => {
    onlineMessages.value.push(message)
  }

  const addOfflineMessage = (message) => {
    offlineMessages.value.push(message)
  }

  const clearMessage = () => {
    beforeMessages.value = []
  }

  return {
    beforeMessages,
    offlineMessages,
    onlineMessages,
    addOnlineMessage,
    addOfflineMessage,
    clearMessage,
  }
})
