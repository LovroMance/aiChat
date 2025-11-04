import { useUnreadMessagesStore } from '@/stores/unreadMessages'
import { UNREAD_MESSAGES_STORE, putData } from '@/utils/indexedDB'
import { formatTimeHour } from '@/utils/format'
import { getThreadInfo } from '@/api/thread'

/**
 * 加载 IndexedDB 中的未读消息数据到 Pinia 仓库
 * @returns {Promise<boolean>} 加载是否成功
 */
export const loadUnreadMessagesData = async () => {
  try {
    const unreadMessagesStore = useUnreadMessagesStore()
    // 调用 store 中的方法从 IndexedDB 加载数据
    await unreadMessagesStore.loadUnreadMessagesFromDB()

    console.log('未读消息数据加载成功')
    return true
  } catch (error) {
    console.error('加载未读消息数据失败:', error)
    return false
  }
}

// 适用于收到消息时 缺少threadInfo的场景
export const putRecord = async (messageData) => {
  // 在函数内部获取 store
  const unreadMessagesStore = useUnreadMessagesStore()

  var passObj = unreadMessagesStore.unreadMessagesMap.get(messageData.thread_id) || null
  console.log('passObj', passObj)

  if (!passObj?.thread_name) {
    const { data } = await getThreadInfo({ thread_id: messageData.thread_id })
    console.log('thread/info / api 获取thread基本信息', data)
    passObj = {
      ...passObj,
      thread_avatar: data.data.thread_avatar,
      thread_name: data.data.thread_name,
      type: data.data.thread_type,
    }
  }

  const valueObj = {
    ...passObj,
    thread_id: messageData.thread_id,
    senderName: messageData.sender_name,
    content: messageData.content,
    lastTime: formatTimeHour(messageData.update_time),
    unreadCount: passObj.unreadCount ? passObj.unreadCount + 1 : 1,
  }

  // 仓库更新
  unreadMessagesStore.unreadMessagesMap.set(messageData.thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
  console.log('valueObj', valueObj)
  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
}

// 适用于拥有所有数据时处理
export const putWholeRecord = async (data) => {
  const unreadMessagesStore = useUnreadMessagesStore()
  var passObj = unreadMessagesStore.unreadMessagesMap.get(data.thread_id) || null
  const passCount = passObj ? passObj.unreadCount : 0
  // TODO: 这里没处理ai  ⭐⭐⭐
  var generalObj = {
    thread_id: data.thread_id,
    senderName: data.latest_message.sender_name,
    content: data.latest_message.content,
    lastTime: formatTimeHour(data.latest_message.update_time),
    unreadCount: data.unread_count + passCount,
    type: data.thread_info.type,
  }
  var valueObj = {}
  if (data.thread_info.type === 'group') {
    valueObj = {
      ...generalObj,
      thread_name: data.thread_info.name,
      thread_avatar: data.thread_info.avatar,
    }
  } else if (data.thread_info.type === 'private') {
    valueObj = {
      ...generalObj,
      thread_name: data.latest_message.sender_name,
      thread_avatar: data.latest_message.sender_avatar,
    }
  }

  // 仓库更新
  unreadMessagesStore.unreadMessagesMap.set(valueObj.thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
  console.log('valueObj', valueObj)
  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
}
