import { ElMessage } from 'element-plus'
import { isLoading } from '@/stores/index'
import { chatPath, createWebSocket } from '@/utils/websocket.js'
import { loadUnreadMessagesData } from '@/service/unreadMessageService'
import { loadMessagesData } from '@/service/messageService'

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
  } catch (error) {
    console.error('应用数据初始化失败:', error)
    return false
  } finally {
    // 无论成功还是失败，都要将加载状态设为 false
    isLoading.value = false
  }
}
