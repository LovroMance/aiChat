import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import { receiveMessage } from '@/core/onMessage'
import { receiveAiMessage } from '@/core/onAiMessage'

const wsBaseURL = import.meta.env?.VITE_APP_WS_BASE

export const chatPath = '/ws/chat' // 用户聊天（私聊/群聊）

let ws = null // websocket实例
let isConnected = false

export const createWebSocket = (path) => {
  // 动态获取token，确保获取最新的token
  const userInfo = getStorage(USER_LOGIN_INFO)
  const token = userInfo.token

  if (!token) {
    console.error('Token不存在，无法建立WebSocket连接')
    return
  }

  if (!wsBaseURL) {
    console.error('VITE_APP_WS_BASE 未配置，无法建立WebSocket连接')
    return
  }

  // 如果已经连接，先关闭现有连接
  if (ws && isConnected) {
    closeWebSocket()
  }

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
        // 处理收到消息逻辑
        if (isAiMessage(data)) {
          console.log('AI消息处理')
          receiveAiMessage(data)
        } else {
          console.log('普通消息处理')
          receiveMessage(data)
        }
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
  }

  // 设置连接错误钩子
  ws.onerror = (error) => {
    console.error('WebSocket连接错误:', error)
    isConnected = false
  }
}

const isAiMessage = (data) => {
  //TODO： 这里到时候统一ai的返回有一个类型判断是ai的回复， 然后统一一下这里的判断条件
  if (!data) return false
  // 流式：{ message, request_id, thread_id }
  if (data.message && data.request_id && data.thread_id) return true
  // 完成：{ is_complete, message_id, thread_id }
  if (data.is_complete === true && data.thread_id) return true
  // 完成思考字段：complete_reason
  if (
    data.complete_reason !== undefined &&
    data.complete_reason !== null &&
    data.complete_reason !== ''
  ) {
    return true
  }
  return false
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
