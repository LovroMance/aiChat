import { ref } from 'vue'
import { showWarningTip } from '@/utils/messageTips'
import { sendMessage } from '@/utils/websocket'
import { useThreadStore } from '@/stores'

/**
 * 聊天输入框逻辑封装
 * 负责：消息输入、发送、回车快捷键
 * @param {Function} emit - 组件的 emit 方法，可选
 */
export function useMessageInput(emit) {
  const input = ref('')
  const threadStore = useThreadStore()

  const send = async () => {
    if (!input.value.trim()) {
      showWarningTip('消息内容不能为空')
      return
    }

    if (!threadStore.activeThread) {
      showWarningTip('没有选中的线程，无法发送消息')
      return
    }

    const messageObj = {
      content: input.value.trim(),
      attachment: null,
      thread_id: threadStore.activeThread.thread_id,
    }

    const result = await sendMessage(messageObj)
    if (result) {
      input.value = ''
      emit?.('messageSent')
    } else {
      console.error('消息发送失败')
    }
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return {
    input,
    send,
    handleKeydown,
  }
}
