import { ElMessage } from 'element-plus'
import { useUnreadMessagesStore } from '@/stores/unreadMessages'
import { useMessageStore } from '@/stores/message'
import { isLoading } from '@/stores/index'
import { chatPath, createWebSocket } from '@/utils/websocket.js'

/**
 * 加载 IndexedDB 中的未读消息数据到 Pinia 仓库
 * @returns {Promise<boolean>} 加载是否成功
 */
export const loadUnreadMessagesData = async () => {
  try {
    const unreadMessagesStore = useUnreadMessagesStore()
    // 调用 store 中的方法从 IndexedDB 加载数据
    await unreadMessagesStore.loadUnreadMessagesFromDB()

    console.log('未读消息数据加载成功')
    return true
  } catch (error) {
    console.error('加载未读消息数据失败:', error)
    return false
  }
}

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

/**
 * 应用启动时的数据初始化函数
 * 可以在应用启动时调用，加载所有必要的数据
 */
export const initializeAppData = async () => {
  const startTime = performance.now() // 记录开始时间

  try {
    console.log('开始初始化应用数据...')

    // 设置加载状态为 true
    isLoading.value = true

    // 加载未读消息数据
    const unreadMessagesLoaded = await loadUnreadMessagesData()

    // 加载历史消息数据
    const messagesLoaded = await loadMessagesData()

    const endTime = performance.now() // 记录结束时间
    const duration = (endTime - startTime).toFixed(2) // 计算耗时（毫秒）

    if (unreadMessagesLoaded && messagesLoaded) {
      console.log('应用数据初始化完成')
    } else {
      console.warn('部分数据加载失败，但应用可以继续运行')
    }

    console.log('数据加载耗时:', duration)

    // 在数据加载完成后，建立WebSocket连接
    console.log('数据加载完成，现在开始初始化WebSocket连接...')
    try {
      createWebSocket(chatPath)
      console.log('WebSocket连接初始化完成')
    } catch (error) {
      console.error('WebSocket初始化失败:', error)
      ElMessage({
        message: 'WebSocket连接初始化失败，请检查网络连接',
        type: 'warning',
      })
    }

    return unreadMessagesLoaded && messagesLoaded
  } catch (error) {
    console.error('应用数据初始化失败:', error)
    return false
  } finally {
    // 无论成功还是失败，都要将加载状态设为 false
    isLoading.value = false
  }

}
