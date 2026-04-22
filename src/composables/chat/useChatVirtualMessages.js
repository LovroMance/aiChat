import { computed } from 'vue'

const HISTORY_DIVIDER_ITEM_ID = '__history-divider__'
const HISTORY_DIVIDER_HEIGHT = 48

// 将消息列表包装成带有虚拟列表层信息的格式，方便后续在虚拟列表中区分不同层的消息并进行特殊处理。
// item_id 和 item_type 是为了满足虚拟列表组件的需求，确保每条消息都有唯一的标识和类型。
const withLayer = (messages, layer) => {
  return (messages || [])
    .filter(Boolean)
    .map((message) => ({
      ...message,
      item_id: message.message_id,
      item_type: 'message',
      __virtual_layer: layer,
    }))
}

export function useChatVirtualMessages(messageStore) {
  const historyMessages = computed(() => {
    return [
      ...withLayer(messageStore.beforeMessages, 'before'),
      ...withLayer(messageStore.offlineMessages, 'offline'),
    ]
  })

  const onlineMessages = computed(() => {
    return withLayer(messageStore.onlineMessages, 'online')
  })

  const renderMessages = computed(() => {
    const historyList = historyMessages.value
    const onlineList = onlineMessages.value
    const next = [...historyList]

    if (historyList.length) {
      next.push({
        item_id: HISTORY_DIVIDER_ITEM_ID,
        item_type: 'history-divider',
        __virtual_height: HISTORY_DIVIDER_HEIGHT,
      })
    }

    next.push(...onlineList)
    return next
  })

  // 虚拟渲染列表中项的数量
  const renderMessageCount = computed(() => renderMessages.value.length)
  // 在线消息的数量，用于判断是否需要滚动到底部等逻辑
  const onlineMessageCount = computed(() => onlineMessages.value.length)

  return {
    renderMessages,
    renderMessageCount,
    onlineMessageCount,
  }
}
