import { useAiMessagesStore } from '@/stores/aiMessages'

// 处理 AI 会话收到的消息：写入 store（store 内部会持久化到 IndexedDB）
export const receiveAiMessage = async (data) => {
  try {
    if (!data?.thread_id) return
    const aiMessagesStore = useAiMessagesStore()

    // 流式消息：{ message: { content, role }, request_id, thread_id }
    // TODO：这里是需要后面加字段规范一下
    if (data?.message && data?.request_id) {
      const streamMessage = {
        message_id: data.request_id,
        thread_id: data.thread_id,
        role: data.message?.role ?? 'assistant',
        content: data.message?.content ?? '',
        reasoning_content: data.message?.reasoning_content ?? '',
        status: 'streaming',
        time_ts: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      aiMessagesStore.upsertStreamingMessage(data.thread_id, data.request_id, streamMessage)
      return
    }

    // 最终消息：{ complete_content, complete_reason, is_complete, message_id, thread_id }
    const messageId = data?.message_id ?? data?.request_id ?? Date.now()
    const normalized = {
      message_id: messageId,
      thread_id: data.thread_id,
      role: data?.role ?? 'assistant',
      content: data?.complete_content ?? data?.content ?? '',
      reasoning_content: data?.complete_reason,
      status: 'done',
      time_ts: Date.now(),
      time: new Date().toLocaleTimeString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    await aiMessagesStore.finalizeStreamMessage(data.thread_id, normalized)
  } catch (error) {
    console.error('处理 AI 消息失败:', error)
  }
}
