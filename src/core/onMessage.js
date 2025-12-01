import { MESSAGES_STORE, addData } from '@/utils/indexedDB'
import { useMessageStore, useThreadStore } from '@/stores'
import { putRecord } from '@/service/unreadMessageService'

export const receiveMessage = async (data) => {
  const messageStore = useMessageStore()
  const threadStore = useThreadStore()
  if (threadStore.activeThread?.value?.thread_id !== data.thread_id) {
    // 不是当前激活的线程
    await addData(MESSAGES_STORE, data) // 将消息添加到IndexedDB
    putRecord(data)
  } else {
    // 是当前激活的线程
    await addData(MESSAGES_STORE, data) // 将消息添加到IndexedDB
    messageStore.addOnlineMessage(data) // 将消息添加到本地内存store中
    putRecord(data) // 将消息记录到未读消息表中
  }
}
