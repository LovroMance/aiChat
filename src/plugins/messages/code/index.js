import CodeMessage from '@/plugins/messages/code/CodeMessage.vue'
import { MESSAGE_TYPES } from '@/core/message/messageTypes'

export const codeMessagePlugin = {
  type: MESSAGE_TYPES.CODE,
  component: CodeMessage,
  match(message) {
    return message?.type === MESSAGE_TYPES.CODE
  },
}
