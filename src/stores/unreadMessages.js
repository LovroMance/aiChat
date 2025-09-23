import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UNREAD_MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useUnreadMessagesStore = defineStore('unreadMessages', () => {
    const unreadMessagesMap = ref(new Map())
    const thread_id = ref('')  // 一个thread只需要一条最后消息
    const valueObject = {
        thread_id: '',  // 会话id
        thread_name: '',  // 群名/好友名/AI名
        thread_avatar: '',  // 头像
        senderName: '',  // 发送者名字
        content: '',  // 最后一条消息
        lastTime: '' ,  // 最后一条消息时间
        unreadCount: 0,   // 未读消息数
        type: '',  // 会话类型（group）
    }

    /**
     * 从 IndexedDB 加载未读消息到 store 中
     */
    const loadUnreadMessagesFromDB = async () => {
        try {
            console.log('正在从 IndexedDB 加载未读消息...')
            
            // 获取所有未读消息数据
            const unreadMessages = await getAllData(UNREAD_MESSAGES_STORE)
            
            // 清空现有的 Map
            unreadMessagesMap.value.clear()
            
            // 将数据加载到 Map 中
            unreadMessages.forEach(message => {
                if (message.thread_id) {
                    unreadMessagesMap.value.set(message.thread_id, message)
                }
            })
            
            console.log(`成功加载 ${unreadMessages.length} 条未读消息到 store 中`)
            console.log('unreadMessagesMap:', unreadMessagesMap.value)
            
            return unreadMessages
        } catch (error) {
            console.error('从 IndexedDB 加载未读消息失败:', error)
            throw error
        }
    }

    /**
     * 添加或更新未读消息
     * @param {string} threadId - 线程 ID
     * @param {Object} messageData - 消息数据
     */
    const updateUnreadMessage = (threadId, messageData) => {
        if (threadId && messageData) {
            unreadMessagesMap.value.set(threadId, messageData)
            console.log(`更新未读消息: thread_id=${threadId}`, messageData)
        }
    }

    /**
     * 删除指定线程的未读消息
     * @param {string} threadId - 线程 ID
     */
    const removeUnreadMessage = (threadId) => {
        if (unreadMessagesMap.value.has(threadId)) {
            unreadMessagesMap.value.delete(threadId)
            console.log(`删除未读消息: thread_id=${threadId}`)
        }
    }

    /**
     * 清空所有未读消息
     */
    const clearUnreadMessages = () => {
        unreadMessagesMap.value.clear()
        console.log('已清空所有未读消息')
    }


    return {
        unreadMessagesMap,
        thread_id,
        valueObject,
        loadUnreadMessagesFromDB,
        updateUnreadMessage,
        removeUnreadMessage,
        clearUnreadMessages
    }
})