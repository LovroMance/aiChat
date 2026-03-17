import { MESSAGES_STORE, addData } from '@/utils/indexedDB'
import { useMessageStore, useThreadStore } from '@/stores'
import { putRecord } from '@/core/unreadMessage'

// 处理群聊消息：先持久化，再按当前会话决定是否立即展示，最后更新未读
export const receiveMessage = async (data) => {
  const messageStore = useMessageStore()
  const threadStore = useThreadStore()
  // TODO： 分类后这里直接传data.data进来，过滤掉type
  try {
    await addData(MESSAGES_STORE, data.data)
    await putRecord(data.data)  // 处理未读
    const isActive = threadStore.activeThread?.thread_id === data.data.thread_id
    if (isActive) {
      messageStore.addOnline(data.data.thread_id, data.data)
    }
  } catch (error) {
    console.error('处理收到的消息失败:', error)
  }
}
