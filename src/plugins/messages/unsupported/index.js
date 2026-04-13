import UnsupportedMessage from '@/plugins/messages/unsupported/UnsupportedMessage.vue'
import { MESSAGE_TYPES } from '@/core/message/messageTypes'

export const unsupportedMessagePlugin = {
  type: MESSAGE_TYPES.UNSUPPORTED,
  component: UnsupportedMessage,
  match() {
    return true
  },
}
