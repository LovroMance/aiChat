import {
  MESSAGES_STORE,
  getDataByKey,
  getMessagesByThreadId,
  getLastData,
  putData,
} from '@/utils/indexedDB'
import { getPartMessages, getUnreadMessages } from '@/api/chat'
import { putWholeRecord } from '@/core/unreadMessage'
import { useMessageStore } from '@/stores'
import { selectedChatUpdate } from '@/core/unreadMessage'

let existing_id // 记录进入聊天室时本地的最后一条消息ID

// 初始化聊天面板（一些准备）
export const initChatPanel = async () => {
  // 1. 获取离线未读消息记录
  // 2. 获取最后一条本地聊天记录id
  const getLastMessageId = await getLastData(MESSAGES_STORE)
  const getUnreadMessageId = await getDataByKey(MESSAGES_STORE, -1)
  const msgId = Math.max(getLastMessageId?.msg_id ?? 0, getUnreadMessageId?.unreadMessageId ?? 0)
  console.log('unreadMessageId', msgId)
  // 3. 获取离线未读消息记录（根据msg_id获取聊天历史）
  const res = await getUnreadMessages({
    existing_id: msgId,
  })
  console.log('getUnreadMessages/api --> 离线消息', res.data)
  for (const record of res.data) {
    await putWholeRecord(record)
  }

  const maxLatestMessageId = res.data
    ? res.data.reduce((max, item) => Math.max(max, item?.latest_message?.message_id ?? 0), 0)
    : 0
  console.log('latest_message 最大 message_id:', maxLatestMessageId)
  const unreadMessageId = Math.max(msgId, maxLatestMessageId)
  // 更新记录unreadMsgId
  putData(MESSAGES_STORE, {
    msg_id: -1,
    unreadMessageId,
  })
}

// 加载指定线程的聊天记录
export const loadThreadChat = async (thread_id) => {
  // 清理 onlineMessage
  const messageStore = useMessageStore()
  messageStore.onlineMessages = []
  // 根据threadId获取本地历史消息
  messageStore.beforeMessages = await getMessagesByThreadId(MESSAGES_STORE, thread_id)
  // 获取最后一条本地消息的msg_id
  const lastMessage = messageStore.beforeMessages[messageStore.beforeMessages.length - 1]
  existing_id = lastMessage?.msg_id ?? 0
  // 根据threadId获取离线消息
  const { data } = await getPartMessages({
    thread_id: thread_id,
    existing_id,
  })
  const appendList = data ? data : []
  messageStore.offlineMessages.push(...appendList)
  // 更新未读消息记录(包括仓库和db)
  await selectedChatUpdate(thread_id)
}
