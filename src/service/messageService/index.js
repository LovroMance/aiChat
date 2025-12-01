import { useMessageStore } from '@/stores/message'

export const loadMessagesData = async () => {
  try {
    const messageStore = useMessageStore()
    // 调用 store 中的方法从 IndexedDB 加载数据
    await messageStore.loadMessagesFromDB()
    console.log('历史消息数据加载成功')
    return true
  } catch (error) {
    console.error('加载消息数据失败:', error)
    return false
  }
}
