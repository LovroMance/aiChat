import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore('message', () => {
    const receiveMessages = ref([])

    const addMessage = (message) => {
        receiveMessages.value.push(message)
    }
    
    const clearMessage = () => {
        receiveMessages.value = []
    }

    return {
        receiveMessages,
        addMessage,
        clearMessage
    }
})