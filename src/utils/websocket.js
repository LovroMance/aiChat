import { useUserStore, useWebSocketStore, WS_STATUS } from '@/stores/index'
import { classifyWsMessage } from '@/core/websocketDispatch/messageClassifier'
import { dispatchWsMessage } from '@/core/websocketDispatch/messageDispatcher'

const wsBaseURL = import.meta.env?.VITE_APP_WS_BASE || ''

export const chatPath = '/ws/chat' // 用户聊天（私聊/群聊）

const HEARTBEAT_INTERVAL = 25000
const MAX_RECONNECT_ATTEMPTS = 6
const RECONNECT_BASE_DELAY = 1500
const RECONNECT_MAX_DELAY = 12000

let ws = null
let reconnectTimer = null
let heartbeatTimer = null

const getWebSocketStore = () => useWebSocketStore()

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

const clearHeartbeatTimer = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

const cleanupSocketInstance = () => {
  if (!ws) return
  ws.onopen = null
  ws.onmessage = null
  ws.onclose = null
  ws.onerror = null
  ws = null
}

const normalizeBase = (base) => {
  if (!base) return ''
  return base.endsWith('/') ? base.slice(0, -1) : base
}

const getRuntimeWebSocketOrigin = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}`
}

const buildSocketUrl = (path, token) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedBase = normalizeBase(wsBaseURL)

  if (!normalizedBase || normalizedBase.startsWith('/')) {
    const basePath = normalizedBase || ''
    return `${getRuntimeWebSocketOrigin()}${basePath}${normalizedPath}?token=${token}`
  }

  return `${normalizedBase}${normalizedPath}?token=${token}`
}

// 指数退避重连机制的延迟计算函数，随着尝试次数增加，延迟时间呈指数增长，但有一个最大值限制
const getReconnectDelay = (attempt) => {
  const delay = RECONNECT_BASE_DELAY * 2 ** Math.max(attempt - 1, 0)
  return Math.min(delay, RECONNECT_MAX_DELAY)
}

// 发送心跳消息，保持连接活跃，并检测连接状态
const sendHeartbeat = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return

  try {
    console.log("发送心跳")
    ws.send(
      JSON.stringify({
        type: 'ping',
        timestamp: Date.now(),
      }),
    )
  } catch (error) {
    console.error('发送 WebSocket 心跳失败:', error)
  }
}

const startHeartbeat = () => {
  clearHeartbeatTimer()
  heartbeatTimer = setInterval(() => {
    sendHeartbeat()
  }, HEARTBEAT_INTERVAL)
}

const stopConnectionSideEffects = () => {
  clearReconnectTimer()
  clearHeartbeatTimer()
}

// 指数退避重连机制 
const scheduleReconnect = () => {
  const webSocketStore = getWebSocketStore()
  const path = webSocketStore.activePath

  if (!path || webSocketStore.isManualClose) {
    return
  }

  const nextAttempt = webSocketStore.reconnectAttempts + 1
  if (nextAttempt > MAX_RECONNECT_ATTEMPTS) {
    webSocketStore.markDisconnected('连接已断开，请稍后手动重试')
    return
  }

  webSocketStore.setReconnectAttempts(nextAttempt)
  webSocketStore.markConnecting({ reconnect: true })

  clearReconnectTimer()
  reconnectTimer = setTimeout(() => {
    createWebSocket(path, { reconnect: true })
  }, getReconnectDelay(nextAttempt))
}

const handleSocketMessage = async (event) => {
  const webSocketStore = getWebSocketStore()
  webSocketStore.markMessageReceived()

  try {
    try {
      const data = JSON.parse(event.data)
      if (data?.type === 'pong') {
        console.log("收到心跳，这里需要后端实际再改一下");
        return
      }
      console.log('收到消息:', data)
      const category = classifyWsMessage(data)
      dispatchWsMessage(category, data)
    } catch {
      console.log('收到消息:', event.data)
    }
  } catch (error) {
    console.error('消息处理失败:', error)
  }
}

const bindEvents = () => {
  if (!ws) return

  ws.onopen = () => {
    const webSocketStore = getWebSocketStore()
    webSocketStore.markConnected()
    clearReconnectTimer()
    startHeartbeat()
    console.log('WebSocket连接成功')
  }

  ws.onmessage = handleSocketMessage

  ws.onclose = (event) => {
    const webSocketStore = getWebSocketStore()
    console.log('WebSocket连接断开:', event.code)
    stopConnectionSideEffects()
    cleanupSocketInstance()

    if (webSocketStore.isManualClose) {
      webSocketStore.setStatus(WS_STATUS.IDLE)
      return
    }

    const reason = event.code === 1000 ? '连接已关闭' : '连接异常断开，正在重连...'
    webSocketStore.markDisconnected(reason)
    scheduleReconnect()
  }

  ws.onerror = () => {
    const webSocketStore = getWebSocketStore()
    webSocketStore.markDisconnected('连接异常，正在尝试恢复...')
    console.error('WebSocket连接错误')
  }
}

export const createWebSocket = (path, { reconnect = false } = {}) => {
  const userStore = useUserStore()
  const webSocketStore = getWebSocketStore()
  const token = userStore.accessToken

  if (!token) {
    webSocketStore.markDisconnected('缺少登录凭证，无法建立连接')
    console.error('Token不存在，无法建立WebSocket连接')
    return false
  }

  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    return true
  }

  webSocketStore.setActivePath(path)
  webSocketStore.setManualClose(false)
  webSocketStore.markConnecting({ reconnect })
  clearReconnectTimer()
  clearHeartbeatTimer()

  if (ws) {
    cleanupSocketInstance()
  }

  try {
    ws = new WebSocket(buildSocketUrl(path, token))
    bindEvents()
    return true
  } catch (error) {
    webSocketStore.markDisconnected('连接创建失败，请稍后重试')
    console.error(path + '连接失败', error)
    scheduleReconnect()
    return false
  }
}

export const sendMessage = async (message) => {
  const webSocketStore = getWebSocketStore()
  if (!ws || ws.readyState !== WebSocket.OPEN || !webSocketStore.isConnected) {
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
    webSocketStore.markDisconnected('发送失败，连接可能已中断')
    return false
  }
}

export const closeWebSocket = ({ manual = true, reset = false } = {}) => {
  const webSocketStore = getWebSocketStore()
  webSocketStore.setManualClose(manual)
  stopConnectionSideEffects()

  if (ws) {
    ws.close(1000, manual ? '用户主动关闭' : '连接已重置')
    cleanupSocketInstance()
    console.log('WebSocket连接已关闭')
  }

  // 重置状态到初始值，适用于用户登出或连接重置场景
  if (reset) {
    webSocketStore.reset()
    return
  }

  // 主动断连后状态置为 IDLE，非主动断连则置为 DISCONNECTED 以触发重连机制
  webSocketStore.setStatus(manual ? WS_STATUS.IDLE : WS_STATUS.DISCONNECTED)
}

export const reconnectWebSocket = () => {
  const webSocketStore = getWebSocketStore()
  const path = webSocketStore.activePath || chatPath
  webSocketStore.setReconnectAttempts(0)
  return createWebSocket(path, { reconnect: true })
}
