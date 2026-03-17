import { useUnreadMessagesStore } from '@/stores/unreadMessages'
import { UNREAD_MESSAGES_STORE, putData } from '@/utils/indexedDB'
import { getThreadInfo } from '@/api/thread'
import { useThreadStore } from '@/stores'

/**
 * 加载 IndexedDB 中的未读消息数据到 Pinia 仓库
 * @returns {Promise<boolean>} 加载是否成功
 */
export const loadUnreadMessagesData = async () => {
  try {
    const unreadMessagesStore = useUnreadMessagesStore()
    // 调用 store 中的方法从 IndexedDB 加载数据
    await unreadMessagesStore.loadUnreadMessagesFromDB()
    console.log('未读消息数据加载成功', unreadMessagesStore.unreadMessagesMap)
    return true
  } catch (error) {
    console.error('加载未读消息数据失败:', error)
    return false
  }
}

// 同意好友申请时的记录
export const putAcceptFriendMessageRecord = async (thread_id, userInfo) => {
  const unreadMessagesStore = useUnreadMessagesStore()
  const valueObj = {
    thread_id: thread_id,
    thread_avatar: userInfo.avatar,
    thread_name: userInfo.username,
    senderName: userInfo.username,
    type: 'private', // 标识为私聊
    content: '我通过了你的好友验证请求，现在我们可以开始聊天了', // 默认生成的系统提示/消息
    lastTime: Math.floor(Date.now() / 1000),
    unreadCount: 0,
  }
  console.log('添加同意好友会话 valueObj', valueObj)
  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
  // 仓库更新
  unreadMessagesStore.updateUnreadMessage(thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
}

// 创建群聊时的记录
export const putCreateGroupMessageRecord = async (groupForm) => {
  // 在函数内部获取 store
  const unreadMessagesStore = useUnreadMessagesStore()
  const valueObj = {
    thread_id: groupForm.thread_id,
    thread_avatar: groupForm.avatar,
    thread_name: groupForm.name,
    senderName: '系统',
    type: '0',
    content: '群聊已创建',
    lastTime: Math.floor(Date.now() / 1000),
    unreadCount: 0,
  }
  console.log('valueObj', valueObj)
  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
  // 仓库更新
  unreadMessagesStore.updateUnreadMessage(groupForm.thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
}

// 适用于收到消息时 缺少threadInfo的场景
export const putRecord = async (receiveMessage) => {
  const unreadMessagesStore = useUnreadMessagesStore()
  // 这里有必要，第一次是没有记录所以passObj是undefined，后续有记录了就是一个对象了。
  // 下面的getThreadInfo接口调用就可以节约掉
  let passObj = unreadMessagesStore.getUnreadRecord(receiveMessage.thread_id)
  console.log('passObj', passObj)

  console.log('thread-name', passObj?.thread_name)
  if (!passObj?.thread_name) {
    const response = await getThreadInfo({ thread_id: receiveMessage.thread_id })
    const threadInfo = response?.data?.data?.info
    passObj = {
      ...passObj,
      thread_avatar: threadInfo?.avatar,
      thread_name: threadInfo?.name,
      type: threadInfo?.type,
    }
  }
  const valueObj = {
    ...passObj,
    thread_id: receiveMessage.thread_id,
    senderName: receiveMessage.sender_name,
    content: receiveMessage.content,
    lastTime: receiveMessage.update_time,
    unreadCount: passObj.unreadCount ? passObj.unreadCount + 1 : 1,
  }

  console.log(valueObj)
  // 如果当前在选中聊天中，则不添加未读消息数
  const threadStore = useThreadStore()
  if (threadStore.activeThread?.thread_id === receiveMessage.thread_id) {
    valueObj.unreadCount = 0
  }

  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
  // 仓库更新
  unreadMessagesStore.updateUnreadMessage(receiveMessage.thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
}

// 适用于拥有所有数据时处理
export const putWholeRecord = async (data) => {
  const unreadMessagesStore = useUnreadMessagesStore()

  const passObj = unreadMessagesStore.getUnreadRecord(data.thread_id)
  const passCount = passObj ? passObj.unreadCount : 0

  var generalObj = {
    thread_id: data.thread_id,
    senderName: data.latest_message.sender_name,
    content: data.latest_message.content,
    lastTime: data.latest_message.update_time,
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

  // indexedDB更新
  await putData(UNREAD_MESSAGES_STORE, valueObj)
  // 仓库更新
  unreadMessagesStore.updateUnreadMessage(valueObj.thread_id, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
  console.log('valueObj', valueObj)
}

export const selectedChatUpdate = async (thread_id) => {
  const unreadMessagesStore = useUnreadMessagesStore()
  const valueObj = unreadMessagesStore.markThreadAsRead(thread_id)
  if (!valueObj) return
  // indexedDB 更新（store 已同步）
  await putData(UNREAD_MESSAGES_STORE, valueObj)
  console.log('更新未读消息成功:', unreadMessagesStore.unreadMessagesMap)
  console.log('valueObj', valueObj)
}
