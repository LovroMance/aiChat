import { MESSAGE_SCENES, MESSAGE_TYPES } from '@/core/message/messageTypes'

const CODE_BLOCK_PATTERN = /```([\w-]+)?\n([\s\S]+?)```/
const IMAGE_URL_PATTERN = /(https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|bmp|svg))/i

const normalizeTimestamp = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 9999999999 ? value : value * 1000
  }

  const dateValue = new Date(value).getTime()
  return Number.isNaN(dateValue) ? Date.now() : dateValue
}

const resolveContentType = (content, attachment) => {
  const attachmentType = attachment?.type || attachment?.file_type || attachment?.mime_type || ''
  if (typeof attachmentType === 'string' && attachmentType.startsWith('image')) {
    return MESSAGE_TYPES.IMAGE
  }

  if (typeof content === 'string' && CODE_BLOCK_PATTERN.test(content)) {
    return MESSAGE_TYPES.CODE
  }

  if (typeof content === 'string' && IMAGE_URL_PATTERN.test(content)) {
    return MESSAGE_TYPES.IMAGE
  }

  return MESSAGE_TYPES.TEXT
}

const buildBaseMessage = ({
  id,
  type,
  scene,
  threadId,
  senderId,
  senderName,
  senderAvatar,
  content,
  meta,
  status,
  createdAt,
  role,
  raw,
}) => ({
  id,
  type,
  scene,
  threadId,
  senderId,
  senderName,
  senderAvatar,
  content,
  meta: meta || {},
  status: status || '',
  createdAt,
  role,
  raw,
})

export const normalizeChatMessage = (rawMessage) => {
  const raw = rawMessage?.data || rawMessage
  const content = raw?.content || ''
  const attachment = raw?.attachment
  const detectedType = raw?.message_type || resolveContentType(content, attachment)

  return buildBaseMessage({
    id: raw?.message_id || raw?.client_message_id || `chat-${Date.now()}`,
    type: detectedType,
    scene: MESSAGE_SCENES.CHAT,
    threadId: raw?.thread_id || '',
    senderId: raw?.sender_uid || '',
    senderName: raw?.sender_name || '',
    senderAvatar: raw?.sender_avatar || '',
    content,
    meta: {
      attachment,
      deliveryStatus: raw?.delivery_status || '',
      isLocal: Boolean(raw?.isLocal),
    },
    status: raw?.delivery_status || '',
    createdAt: normalizeTimestamp(raw?.create_time),
    role: raw?.sender_uid ? 'user' : 'assistant',
    raw,
  })
}

export const normalizeAiMessage = (rawMessage) => {
  const role = rawMessage?.role || rawMessage?.message?.role || 'assistant'
  const content =
    rawMessage?.content ??
    rawMessage?.complete_content ??
    rawMessage?.message?.content ??
    ''
  const reasoningContent =
    rawMessage?.reasoning_content ??
    rawMessage?.complete_reason ??
    rawMessage?.message?.reasoning_content ??
    ''
  const type =
    role === 'assistant'
      ? MESSAGE_TYPES.AI_REPLY
      : resolveContentType(content, rawMessage?.attachment)

  return buildBaseMessage({
    id: rawMessage?.message_id || rawMessage?.request_id || `ai-${Date.now()}`,
    type,
    scene: MESSAGE_SCENES.AI,
    threadId: rawMessage?.thread_id || '',
    senderId: rawMessage?.sender_uid || role,
    senderName: role === 'assistant' ? 'AI Assistant' : '我',
    senderAvatar: rawMessage?.sender_avatar || '',
    content,
    meta: {
      reasoningContent,
      status: rawMessage?.status || (rawMessage?.is_complete ? 'done' : ''),
      requestId: rawMessage?.request_id || '',
    },
    status: rawMessage?.status || (rawMessage?.is_complete ? 'done' : ''),
    createdAt: normalizeTimestamp(rawMessage?.time_ts || rawMessage?.created_at || Date.now()),
    role,
    raw: rawMessage,
  })
}

export const normalizeNoticeMessage = (rawMessage) => {
  return buildBaseMessage({
    id: rawMessage?.id || `notice-${Date.now()}`,
    type: MESSAGE_TYPES.UNSUPPORTED,
    scene: MESSAGE_SCENES.NOTICE,
    threadId: rawMessage?.thread_id || '',
    senderId: '',
    senderName: '系统',
    senderAvatar: '',
    content: rawMessage?.content || '',
    meta: {},
    status: '',
    createdAt: normalizeTimestamp(rawMessage?.create_time || Date.now()),
    role: 'system',
    raw: rawMessage,
  })
}

export const normalizeMessageByScene = (scene, rawMessage) => {
  if (scene === MESSAGE_SCENES.AI) {
    return normalizeAiMessage(rawMessage)
  }

  if (scene === MESSAGE_SCENES.NOTICE) {
    return normalizeNoticeMessage(rawMessage)
  }

  return normalizeChatMessage(rawMessage)
}
