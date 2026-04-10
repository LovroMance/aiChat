import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const WS_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
}

export const useWebSocketStore = defineStore('websocket', () => {
  const status = ref(WS_STATUS.IDLE)
  const reconnectAttempts = ref(0)
  const lastConnectedAt = ref(null)
  const lastMessageAt = ref(null)
  const lastError = ref('')
  const activePath = ref('')
  const isManualClose = ref(false)

  const isConnected = computed(() => status.value === WS_STATUS.CONNECTED)
  const isConnecting = computed(() =>
    [WS_STATUS.CONNECTING, WS_STATUS.RECONNECTING].includes(status.value),
  )

  const setStatus = (nextStatus) => {
    status.value = nextStatus
  }

  const setActivePath = (path) => {
    activePath.value = path || ''
  }

  // 是否主动断连 --> 影响断连后的状态展示和重连行为
  const setManualClose = (value) => {
    isManualClose.value = Boolean(value)
  }

  const markConnected = () => {
    status.value = WS_STATUS.CONNECTED
    reconnectAttempts.value = 0
    lastConnectedAt.value = Date.now()
    lastError.value = ''
  }

  const markMessageReceived = () => {
    lastMessageAt.value = Date.now()
  }

  const markDisconnected = (errorMessage = '') => {
    status.value = WS_STATUS.DISCONNECTED
    if (errorMessage) {
      lastError.value = errorMessage
    }
  }

  const markConnecting = ({ reconnect = false } = {}) => {
    status.value = reconnect ? WS_STATUS.RECONNECTING : WS_STATUS.CONNECTING
    if (!reconnect) {
      lastError.value = ''
    }
  }

  const setReconnectAttempts = (value) => {
    reconnectAttempts.value = value
  }

  const reset = () => {
    status.value = WS_STATUS.IDLE
    reconnectAttempts.value = 0
    lastConnectedAt.value = null
    lastMessageAt.value = null
    lastError.value = ''
    activePath.value = ''
    isManualClose.value = false
  }

  return {
    status,
    reconnectAttempts,
    lastConnectedAt,
    lastMessageAt,
    lastError,
    activePath,
    isManualClose,
    isConnected,
    isConnecting,
    setStatus,
    setActivePath,
    setManualClose,
    markConnected,
    markMessageReceived,
    markDisconnected,
    markConnecting,
    setReconnectAttempts,
    reset,
  }
})
