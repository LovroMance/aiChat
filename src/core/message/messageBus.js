import { normalizeMessageByScene } from '@/core/message/normalizeMessage'
import { MESSAGE_SCENES } from '@/core/message/messageTypes'
import { resolveMessagePlugin } from '@/core/message/messageRegistry'
import { receiveMessage } from '@/core/websocketDispatch/onMessage'
import { receiveAiMessage } from '@/core/websocketDispatch/onAiMessage'
import { receiveNotice } from '@/core/websocketDispatch/onNotice'

const listeners = new Map()

// 消息总线实现，提供事件订阅和发布功能
const getEventListeners = (eventName) => {
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set())
  }

  return listeners.get(eventName)
}

// 订阅消息总线事件，返回一个取消订阅的函数
export const onMessageBus = (eventName, handler) => {
  const eventListeners = getEventListeners(eventName)
  eventListeners.add(handler)

  return () => {
    eventListeners.delete(handler)
  }
}
 
// 发布事件到消息总线，返回是否有处理器命中
export const emitMessageBus = async (eventName, payload) => {
  const eventListeners = listeners.get(eventName)
  if (!eventListeners?.size) return false

  for (const handler of eventListeners) {
    await handler(payload)
  }

  return true
}

const WS_EVENT_MAP = {
  [MESSAGE_SCENES.NOTICE]: 'ws:notice',
  [MESSAGE_SCENES.AI]: 'ws:ai',
  [MESSAGE_SCENES.CHAT]: 'ws:chat',
}

onMessageBus('ws:notice', receiveNotice)
onMessageBus('ws:ai', receiveAiMessage)
onMessageBus('ws:chat', receiveMessage)

export const dispatchBusMessage = async (scene, payload) => {
  const eventName = WS_EVENT_MAP[scene]
  if (!eventName) return false
  return emitMessageBus(eventName, payload)
}


export const resolveRenderedMessage = (scene, rawMessage) => {
  const normalized = normalizeMessageByScene(scene, rawMessage)
  const plugin = resolveMessagePlugin(normalized)

  return {
    ...normalized,
    type: plugin?.type || normalized.type,
    pluginType: plugin?.type || normalized.type,
    renderer: plugin?.component || null,
  }
}

export const buildOutgoingMessage = ({ scene, type, payload }) => {
  const normalized = normalizeMessageByScene(scene, payload)
  const plugin = resolveMessagePlugin({
    ...normalized,
    type,
  })

  if (typeof plugin?.buildSendPayload === 'function') {
    return plugin.buildSendPayload(payload)
  }

  return payload
}
