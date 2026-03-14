import { useUserStore } from '@/stores/index'
import { receiveMessage } from '@/core/onMessage'
import { receiveAiMessage } from '@/core/onAiMessage'
import { classifyWsMessage } from '@/core/messageClassifier'

const wsBaseURL = import.meta.env?.VITE_APP_WS_BASE

export const chatPath = '/ws/chat' // 用户聊天（私聊/群聊）

let ws = null // websocket实例
let isConnected = false

export const createWebSocket = (path) => {
  // 从 Pinia store 动态获取 access_token（内存中的最新值）
  const userStore = useUserStore()
  const token = userStore.accessToken

  if (!token) {
    console.error('Token不存在，无法建立WebSocket连接')
    return
  }

  if (!wsBaseURL) {
    console.error('VITE_APP_WS_BASE 未配置，无法建立WebSocket连接')
    return
  }

  // 防止重复建连：连接中或已连接时直接复用当前连接
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    return
  }

  // 存在旧实例但状态不可用时，先清理再重建
  if (ws) closeWebSocket()

  // 构建WebSocket URL，包含token参数
  const wsUrl = `${wsBaseURL}${path}?token=${token}`

  try {
    ws = new WebSocket(wsUrl)
    bindEvents()
  } catch (error) {
    console.error(path + '连接失败', error)
  }
}

const bindEvents = async () => {
  if (!ws) return

  // 设置连接成功钩子
  ws.onopen = () => {
    isConnected = true
    console.log('WebSocket连接成功')
  }

  // 设置消息监听钩子
  ws.onmessage = async (event) => {
    try {
      // 尝试解析 JSON
      try {
        const data = JSON.parse(event.data) // 把JSON字符串转换为对象
        if (data && Object.prototype.hasOwnProperty.call(data, 'model')) return
        console.log('收到消息:', data)
        const category = classifyWsMessage(data)
        if (category === 'notice') {
          console.log('通知消息，暂不处理')
          return
        }
        if (category === 'ai') {
          console.log('AI消息处理')
          receiveAiMessage(data)
          return
        }
        if (category === 'chat') {
          console.log('普通消息处理')
          receiveMessage(data)
          return
        }
        console.warn('未识别的消息类型:', data)
      } catch {
        // 如果不是 JSON 格式，直接输出原始消息
        console.log('收到消息:', event.data)
      }
    } catch (error) {
      console.error('消息处理失败:', error)
    }
  }

  // 设置连接断开钩子
  ws.onclose = (event) => {
    console.log('WebSocket连接断开:', event.code)
    isConnected = false
    ws = null
  }

  // 设置连接错误钩子
  ws.onerror = (error) => {
    console.error('WebSocket连接错误:', error)
    isConnected = false
  }
}

export const sendMessage = (message) => {
  if (!isConnected || !ws) {
    console.error('WebSocket未连接，无法发送消息')
    return false
  }

  try {
    const messageToSend = JSON.stringify(message)
    ws.send(messageToSend)
    console.log('发送WebSocket消息:', messageToSend)
    return true
  } catch (error) {
    console.error('发送消息失败:', error)
    return false
  }
}

export const closeWebSocket = () => {
  if (ws) {
    ws.close(1000, '用户主动关闭')
    ws = null
    console.log('WebSocket连接已关闭')
    isConnected = false
  }
}
