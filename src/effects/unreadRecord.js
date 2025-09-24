import { useUnreadMessagesStore } from '@/stores/unreadMessages'
import { UNREAD_MESSAGES_STORE, putData } from '@/utils/indexedDB'
import { formatTimeHour } from '@/utils/format'
import { getThreadInfo } from '@/api/thread'

// 这里到时候做一个try catch  如果报错检查原因然后调用查询thread信息进行信息补充
export const putRecord = async (messageData) => {
    // 在函数内部获取 store
    const unreadMessagesStore = useUnreadMessagesStore()
    
    var passObj = unreadMessagesStore.unreadMessagesMap.get(messageData.thread_id) || null
    console.log('passObj', passObj)

    if(!passObj?.thread_name){
        const { data } = await getThreadInfo({ thread_id: messageData.thread_id })
        console.log('thread/info / api 获取thread基本信息', data)
        passObj = {
            ...passObj,
            thread_avatar: data.data.thread_avatar,
            thread_name: data.data.thread_name,
            type: data.data.thread_type
        }
    }

    const tempObj = {
        ...passObj,
        thread_id: messageData.thread_id,
        senderName: messageData.sender_name,
        content: messageData.content,
        lastTime: formatTimeHour(messageData.update_time),
        unreadCount: passObj.unreadCount ? (passObj.unreadCount + 1) : 1,
    }

    // 仓库更新
    unreadMessagesStore.unreadMessagesMap.set(messageData.thread_id, tempObj)
    console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
    console.log('tempObj', tempObj)
    // indexedDB更新
    await putData(UNREAD_MESSAGES_STORE, tempObj)
}