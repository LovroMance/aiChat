import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatListStore = defineStore('chatList', () => {
    const chatMap = ref(new Map())

    const thread_id = ref('')  // 一个thread只需要一条最后消息
    const valueObject = {
        thread_name: ref(''),  // 消息主人公名称
        thread_avatar: ref(''),  // 头像
        senderName: ref(''),  // 发送者名字
        content: ref(''),  // 最后一条消息
        lastTime: ref(''),  // 最后一条消息时间
        unreadCount: ref()  // 未读消息数
    }


    return {
        chatMap,
        thread_id,
        valueObject
    }
})