import { loadUnreadMessagesData } from '@/core/unreadMessage'
import { showWarningTip } from '@/utils/messageTips'
import { chatPath, createWebSocket } from '@/utils/websocket.js'
import { useNotificationStore } from '@/stores'

/**
 * 应用启动时的数据初始化函数
 * 可以在应用启动时调用，加载所有必要的数据
 */
export const initializeAppData = async () => {
  const startTime = performance.now() // 记录开始时间

  try {
    console.log('开始初始化应用数据...')
    // TODO: 这里加一个加载状态
    // 加载未读消息数据
    await loadUnreadMessagesData()

    // 加载通知数据
    const notificationStore = useNotificationStore()
    await notificationStore.initNotifications()

    const endTime = performance.now() // 记录结束时间
    const duration = (endTime - startTime).toFixed(2) // 计算耗时（毫秒）

    console.log(`数据加载完成，耗时: ${duration} 毫秒`)

    try {
      const connected = createWebSocket(chatPath)
      if (!connected) {
        showWarningTip('WebSocket连接初始化失败，请检查登录状态或网络配置')
        return false
      }
      console.log('WebSocket连接初始化完成')
    } catch (error) {
      console.error('WebSocket初始化失败:', error)
      showWarningTip('WebSocket连接初始化失败，请检查网络连接')
    }
  } catch (error) {
    console.error('应用数据初始化失败:', error)
    return false
  }
}
