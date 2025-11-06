import { MESSAGES_STORE, getLastData, getMessagesByThreadId } from '@/utils/indexedDB'
import { getPartMessages, getUnreadMessages } from '@/api/chat'
import { putWholeRecord } from '@/service/unreadMessageService'
import { useMessageStore } from '@/stores'
import { updateRecord } from '@/service/unreadMessageService'

let existing_id // 记录进入聊天室时本地的最后一条消息ID

// 初始化聊天面板（一些准备）
export const initChatPanel = async () => {
  // 1. 获取离线未读消息记录
  // 2. 获取最后一条本地聊天记录id
  const getLastMessageId = await getLastData(MESSAGES_STORE)
  const { message_id } = getLastMessageId ?? { message_id: 0 }
  existing_id = message_id
  console.log('getLastData/indexedDB --> message_id', message_id)

  // 3. 获取离线未读消息记录（根据message_id获取聊天历史）
  const res = await getUnreadMessages({
    existing_id: message_id,
  })
  console.log('getUnreadMessages/api --> 离线消息', res.data)
  for (const record of res.data) {
    await putWholeRecord(record)
  }
}

// 加载指定线程的聊天记录
export const loadThreadChat = async (threadId) => {
  // 清理 onlineMessage
  const messageStore = useMessageStore()
  messageStore.onlineMessages = []
  // 根据threadId获取本地历史消息
  messageStore.beforeMessages = await getMessagesByThreadId(MESSAGES_STORE, threadId)
  const lastMessage = messageStore.beforeMessages[messageStore.beforeMessages.length - 1] // 获取最后一条本地消息的message_id
  existing_id = lastMessage?.message_id ?? 0
  // 根据threadId获取离线消息
  if (existing_id != 0) {
    const { data } = await getPartMessages({
      thread_id: threadId,
      existing_id,
    })
    messageStore.offlineMessages.push(...data.data)
  }
  // 更新未读消息记录(包括仓库和db)
  await updateRecord(threadId)
  // TODO：1.在当前的thread_id收到消息不要添加unreadCount
}
