import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatListStore = defineStore('chatList', () => {
    const chatMap = ref(new Map())

    const thread_id = ref('')  // 一个thread只需要一条最后消息
    const valueObject = {
        thread_id: '',  // 会话id
        thread_name: '',  // 消息主人公名称
        thread_avatar: '',  // 头像
        senderName: '',  // 发送者名字
        content: '',  // 最后一条消息
        lastTime: '' ,  // 最后一条消息时间
        unreadCount: 0,   // 未读消息数
        type: '',  // 会话类型（group）
    }


    return {
        chatMap,
        thread_id,
        valueObject
    }
})