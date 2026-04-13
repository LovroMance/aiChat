import ImageMessage from '@/plugins/messages/image/ImageMessage.vue'
import { MESSAGE_TYPES } from '@/core/message/messageTypes'

export const imageMessagePlugin = {
  type: MESSAGE_TYPES.IMAGE,
  component: ImageMessage,
  match(message) {
    return message?.type === MESSAGE_TYPES.IMAGE
  },
}
