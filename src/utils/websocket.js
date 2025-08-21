import { baseURL } from '@/utils/request'
import { useMessageStore } from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import { MESSAGES_STORE, addData } from '@/utils/indexedDB'


const messageStore = useMessageStore()

export const chatPath = '/ws/chatroom'

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

  // 如果已经连接，先关闭现有连接
  if (ws && isConnected) {
    closeWebSocket()
  }

  // 构建WebSocket URL，包含token参数
  const wsUrl = `${baseURL}${path}?token=${token}`

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
        const data = JSON.parse(event.data)  // 把JSON字符串转换为对象
        console.log('收到消息:', data)
        await addData(MESSAGES_STORE, data) // 将消息添加到IndexedDB
        messageStore.addMessage(data) // 将消息添加到本地内存store中
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

// 获取连接状态
export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: ws ? ws.readyState : null,
  }
}
