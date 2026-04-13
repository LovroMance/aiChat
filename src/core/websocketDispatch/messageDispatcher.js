import { dispatchBusMessage } from '@/core/message/messageBus'

/**
 * 根据分类结果执行对应分发逻辑
 * @param {'notice' | 'ai' | 'chat' | 'unknown'} category
 * @param {any} data
 * @returns {boolean} 是否命中处理器
 */
export const dispatchWsMessage = (category, data) => {
  return dispatchBusMessage(category, data)
}
