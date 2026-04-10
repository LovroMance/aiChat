import { ref } from 'vue'
import { showWarningTip } from '@/utils/messageTips'
import { sendMessage } from '@/utils/websocket'
import { useThreadStore, useWebSocketStore } from '@/stores'

/**
 * 聊天输入框逻辑封装
 * 负责：消息输入、发送、回车快捷键
 * @param {Function} emit - 组件的 emit 方法，可选
 */
export function useMessageInput(emit) {
  const input = ref('')
  const threadStore = useThreadStore()
  const webSocketStore = useWebSocketStore()

  const send = async () => {
    if (!input.value.trim()) {
      showWarningTip('消息内容不能为空')
      return
    }

    if (!threadStore.activeThread) {
      showWarningTip('没有选中的线程，无法发送消息')
      return
    }

    if (!webSocketStore.isConnected) {
      const message =
        webSocketStore.status === 'reconnecting'
          ? '连接正在恢复中，请稍后重试'
          : webSocketStore.lastError || '连接未建立，暂时无法发送消息'
      showWarningTip(message)
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
      showWarningTip(webSocketStore.lastError || '消息发送失败，请稍后重试')
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
