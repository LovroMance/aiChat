import { MESSAGES_STORE, addData } from '@/utils/indexedDB'
import { useMessageStore, useThreadStore } from '@/stores'
import { putRecord } from '@/core/unreadMessage'

// 统一处理 WebSocket 收到的消息：先持久化，再按当前会话决定是否立即展示，最后更新未读
export const receiveMessage = async (data) => {
  const messageStore = useMessageStore()
  const threadStore = useThreadStore()

  try {
    await addData(MESSAGES_STORE, data)
    const isActive = threadStore.activeThread?.thread_id === data.thread_id
    if (isActive) {
      messageStore.addOnline(data.thread_id, data)
    }
    await putRecord(data)
  } catch (error) {
    console.error('处理收到的消息失败:', error)
  }
}
