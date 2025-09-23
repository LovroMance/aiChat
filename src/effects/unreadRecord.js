import { useUnreadMessagesStore } from '@/stores/unreadMessages'
const unreadMessagesStore = useUnreadMessagesStore()

import { UNREAD_MESSAGES_STORE, putData } from '@/utils/indexedDB'
import { formatTimeHour } from '@/utils/format'

// 这里到时候做一个try catch  如果报错检查原因然后调用查询thread信息进行信息补充
export const putRecord = async (messageData) => {
    const passObj = unreadMessagesStore.unreadMessagesMap.get(messageData.thread_id) || null
    console.log('passObj', passObj)

    if(!passObj.thread_name){
        // logger.info('未找到thread_name, 查询thread信息进行补充')
    }

    const tempObj = {
        ...passObj,
        thread_id: messageData.thread_id,
        senderName: messageData.sender_name,
        content: messageData.content,
        lastTime: formatTimeHour(messageData.update_time),
        unreadCount: passObj ? (passObj.unreadCount + 1) : 1,
    }

    // 仓库更新
    unreadMessagesStore.unreadMessagesMap.set(messageData.thread_id, tempObj)
    console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)

    console.log('tempObj', tempObj)
    // indexedDB更新
    await putData(UNREAD_MESSAGES_STORE, tempObj)


}