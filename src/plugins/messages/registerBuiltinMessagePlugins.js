import { registerMessagePlugin } from '@/core/message/messageRegistry'
import { textMessagePlugin } from '@/plugins/messages/text'
import { imageMessagePlugin } from '@/plugins/messages/image'
import { codeMessagePlugin } from '@/plugins/messages/code'
import { aiReplyMessagePlugin } from '@/plugins/messages/aiReply'
import { unsupportedMessagePlugin } from '@/plugins/messages/unsupported'

let registered = false

export const registerBuiltinMessagePlugins = () => {
  if (registered) return
  ;[
    textMessagePlugin,
    imageMessagePlugin,
    codeMessagePlugin,
    aiReplyMessagePlugin,
    unsupportedMessagePlugin,
  ].forEach(registerMessagePlugin)

  registered = true
}
