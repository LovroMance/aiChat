import { useMessageStore, useUserStore, useWebSocketStore } from '@/stores'
import { sendMessage } from '@/utils/websocket'

const createClientMessageId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const buildLocalMessage = ({ clientMessageId, threadId, content, userStore }) => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  return {
    message_id: clientMessageId,
    client_message_id: clientMessageId,
    thread_id: threadId,
    sender_uid: userStore.uid,
    sender_name: userStore.username || userStore.account || '我',
    sender_avatar: userStore.avatar || '',
    content,
    attachment: null,
    create_time: nowSeconds,
    delivery_status: 'sending',
    isLocal: true,
  }
}

const buildTransportPayload = ({ threadId, content }) => {
  return {
    content,
    attachment: null,
    thread_id: threadId,
  }
}

const markFailedAndQueue = (messageStore, threadId, clientMessageId, queueItem) => {
  messageStore.updateOnlineMessage(threadId, clientMessageId, {
    delivery_status: 'failed',
  })
  messageStore.enqueuePendingMessage(queueItem)
}

const markQueued = (messageStore, threadId, clientMessageId, queueItem) => {
  messageStore.updateOnlineMessage(threadId, clientMessageId, {
    delivery_status: 'queued',
  })
  messageStore.enqueuePendingMessage(queueItem)
}

const attemptSendQueueItem = async (queueItem) => {
  const messageStore = useMessageStore()
  const webSocketStore = useWebSocketStore()

  if (!queueItem?.thread_id || !queueItem?.client_message_id) {
    return false
  }

  if (!webSocketStore.isConnected) {
    markQueued(messageStore, queueItem.thread_id, queueItem.client_message_id, queueItem)
    return false
  }

  messageStore.updateOnlineMessage(queueItem.thread_id, queueItem.client_message_id, {
    delivery_status: 'sending',
  })

  const result = await sendMessage(queueItem.payload)
  if (result) {
    messageStore.updateOnlineMessage(queueItem.thread_id, queueItem.client_message_id, {
      delivery_status: 'sent',
    })
    // 出队
    messageStore.dequeuePendingMessage(queueItem.client_message_id)
    return true
  }

  markFailedAndQueue(messageStore, queueItem.thread_id, queueItem.client_message_id, queueItem)
  return false
}

export const submitChatMessage = async ({ threadId, content }) => {
  const messageStore = useMessageStore()
  const userStore = useUserStore()
  const webSocketStore = useWebSocketStore()

  const clientMessageId = createClientMessageId()
  const localMessage = buildLocalMessage({
    clientMessageId,
    threadId,
    content,
    userStore,
  })
  const queueItem = {
    client_message_id: clientMessageId,
    thread_id: threadId,
    payload: buildTransportPayload({ threadId, content }),
  }

  messageStore.addLocalMessage(threadId, localMessage)

  if (!webSocketStore.isConnected) {
    markQueued(messageStore, threadId, clientMessageId, queueItem)
    return {
      ok: false,
      queued: true,
    }
  }

  // 真要发送了
  const success = await attemptSendQueueItem(queueItem)
  return {
    ok: success,
    queued: !success,
  }
}

export const retryPendingChatMessage = async (clientMessageId) => {
  const messageStore = useMessageStore()
  const queueItem = messageStore.getPendingMessage(clientMessageId)
  if (!queueItem) return false
  return attemptSendQueueItem(queueItem)
}

export const flushPendingChatMessages = async () => {
  const messageStore = useMessageStore()
  const pendingItems = messageStore.getPendingQueue()

  for (const item of pendingItems) {
    await attemptSendQueueItem(item)
  }
}
