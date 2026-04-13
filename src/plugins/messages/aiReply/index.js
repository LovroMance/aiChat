import AiReplyMessage from '@/plugins/messages/aiReply/AiReplyMessage.vue'
import { MESSAGE_TYPES } from '@/core/message/messageTypes'

export const aiReplyMessagePlugin = {
  type: MESSAGE_TYPES.AI_REPLY,
  component: AiReplyMessage,
  match(message) {
    return message?.type === MESSAGE_TYPES.AI_REPLY
  },
}
