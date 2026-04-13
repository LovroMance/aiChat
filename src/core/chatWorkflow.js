import {
  MESSAGES_STORE,
  getDataByKey,
  getMessagesByThreadId,
  getLastData,
  putData,
} from '@/utils/indexedDB'
import { getPartMessages, getUnreadMessages } from '@/api/chat'
import { putWholeRecord, selectedChatUpdate } from '@/core/unreadMessage'
import { useMessageStore } from '@/stores'

const normalizeMessages = (list) => {
  if (!Array.isArray(list)) return []
  return [...list].sort((left, right) => Number(left?.message_id ?? 0) - Number(right?.message_id ?? 0))
}

const getLatestMessageId = (list) => {
  const lastMessage = list[list.length - 1]
  return lastMessage?.message_id ?? 0
}

// 初始化阶段先同步未读总览，把离线会话元数据补齐到本地。
export const initChatPanel = async () => {
  const getLastMessageId = await getLastData(MESSAGES_STORE)
  const getUnreadMessageId = await getDataByKey(MESSAGES_STORE, -1)
  const msgId = Math.max(
    getLastMessageId?.message_id ?? 0,
    getUnreadMessageId?.unreadMessageId ?? 0,
  )

  const res = await getUnreadMessages({
    existing_id: msgId,
  })

  for (const record of res.data) {
    await putWholeRecord(record)
  }

  const maxLatestMessageId = res.data
    ? res.data.reduce((max, item) => Math.max(max, item?.latest_message?.message_id ?? 0), 0)
    : 0
  const unreadMessageId = Math.max(msgId, maxLatestMessageId)

  await putData(MESSAGES_STORE, {
    message_id: -1,
    unreadMessageId,
  })
}

const syncOfflineMessages = async (threadId, existingId) => {
  const messageStore = useMessageStore()
  let cursor = existingId

  messageStore.setOfflineSyncing(threadId, true)

  try {
    while (true) {
      const { data } = await getPartMessages({
        thread_id: threadId,
        existing_id: cursor,
        num: messageStore.REMOTE_HISTORY_PAGE_SIZE,
      })

      const nextBatch = normalizeMessages(data)
      if (!nextBatch.length) {
        break
      }

      // 离线消息按批次追加，让用户在同步期间也能逐步看到新内容。
      messageStore.appendOffline(threadId, nextBatch)
      cursor = getLatestMessageId(nextBatch)
    }
  } finally {
    messageStore.setOfflineSyncing(threadId, false)
  }
}

export const loadThreadChat = async (threadId) => {
  const messageStore = useMessageStore()
  // Step 1：切换会话时先重置当前 thread 的消息状态。
  messageStore.resetThread(threadId)
  // Step 2：首屏加载期间使用独立 loading，避免和离线同步提示混用。
  messageStore.setInitialLoading(threadId, true)

  try {
    // Step 3：优先读取本地历史，让首屏可以立即展示最近一段消息。
    const localHistory = normalizeMessages(await getMessagesByThreadId(MESSAGES_STORE, threadId))
    const existingId = getLatestMessageId(localHistory)

    messageStore.setHistory(threadId, localHistory)

    // Step 4：再基于本地最后一条消息循环补齐离线新增消息，直到接口返回空。
    await syncOfflineMessages(threadId, existingId)

    // Step 5：会话打开后把该线程未读状态置为已读。
    await selectedChatUpdate(threadId)
  } finally {
    messageStore.setInitialLoading(threadId, false)
  }
}

export const loadOlderThreadMessages = async (threadId) => {
  const messageStore = useMessageStore()
  const status = messageStore.getHistoryStatus(threadId)

  // Step 1：如果本地历史已经全部展开，直接结束，不再请求远端更早历史。
  if (!status.hasMoreHistory) {
    return {
      source: 'noop',
      count: 0,
      hasMore: false,
    }
  }

  // Step 2：触顶时只展开本地尚未展示的旧消息。
  const { added } = messageStore.expandLocalHistory(threadId)
  const nextStatus = messageStore.getHistoryStatus(threadId)

  return {
    source: 'local',
    count: added,
    hasMore: nextStatus.hasMoreHistory,
  }
}
