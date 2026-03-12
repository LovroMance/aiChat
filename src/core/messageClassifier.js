/**
 * 判断是否是 AI 消息（与 websocket.js 当前规则保持一致）
 * @param {any} data
 * @returns {boolean}
 */
const normalizeWsType = (type) => {
  if (type === undefined || type === null) return null
  return String(type)
}

export const isNoticeMessage = (data) => {
  return normalizeWsType(data?.type) === '0'
}

export const isChatMessage = (data) => {
  return normalizeWsType(data?.type) === '1'
}

export const isAiMessage = (data) => {
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

/**
 * 仅分类，不做任何副作用（不落库、不更新 store）
 * @param {any} data
 * @returns {'notice' | 'ai' | 'chat' | 'unknown'}
 */
export const classifyWsMessage = (data) => {
  if (isNoticeMessage(data)) {
    return 'notice'
  }
  if (!isChatMessage(data)) {
    return 'unknown'
  }
  if (isAiMessage(data)) {
    return 'ai'
  }
  return 'chat'
}

/**
 * 对应 websocket.js 里当前 if-else 的“路由预览”
 * 注意：这个函数目前不在生产流程中调用。
 * @param {any} data
 * @returns {{ category: 'notice' | 'ai' | 'chat' | 'unknown', branch: 'noop' | 'receiveAiMessage' | 'receiveMessage' }}
 */
export const previewDispatchBranch = (data) => {
  const category = classifyWsMessage(data)

  if (category === 'notice') {
    return {
      category,
      branch: 'noop',
    }
  }

  if (category === 'ai') {
    return {
      category,
      branch: 'receiveAiMessage',
    }
  }

  if (category === 'chat') {
    return {
      category,
      branch: 'receiveMessage',
    }
  }

  return {
    category,
    branch: 'noop',
  }
}
