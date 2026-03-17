import { receiveMessage } from '@/core/websocketDispatch/onMessage'
import { receiveAiMessage } from '@/core/websocketDispatch/onAiMessage'
import { receiveNotice } from '@/core/websocketDispatch/onNotice'

const handlers = {
  notice: (data) => {
    receiveNotice(data)
    return true
  },
  ai: (data) => {
    console.log('AI消息处理')
    receiveAiMessage(data)
    return true
  },
  chat: (data) => {
    console.log('普通消息处理')
    receiveMessage(data)
    return true
  },
}

/**
 * 根据分类结果执行对应分发逻辑
 * @param {'notice' | 'ai' | 'chat' | 'unknown'} category
 * @param {any} data
 * @returns {boolean} 是否命中处理器
 */
export const dispatchWsMessage = (category, data) => {
  const handler = handlers[category]
  if (!handler) return false
  return handler(data)
}
