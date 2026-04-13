import TextMessage from '@/plugins/messages/text/TextMessage.vue'
import { MESSAGE_TYPES } from '@/core/message/messageTypes'

export const textMessagePlugin = {
  type: MESSAGE_TYPES.TEXT,
  component: TextMessage,
  match(message) {
    return message?.type === MESSAGE_TYPES.TEXT
  },
  buildSendPayload(payload) {
    return {
      ...payload,
      attachment: payload?.attachment || null,
    }
  },
}
