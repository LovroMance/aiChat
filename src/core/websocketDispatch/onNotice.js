import { useNotificationStore } from '@/stores'

/**
 * 将好友申请通知消息转换成通知中心卡片结构。
 */
export const onFriendRequestNoticed = (payload) => {
  if (!payload || String(payload.type) !== '0') return null

  return {
    notice_id: payload.notice_id,
    tone: 'blue',
    title: '收到好友申请',
    created_time: payload.created_time,
    status: 0,
    username: payload.sender_name,
    avatar: payload.sender_avatar,
    message: payload.message ?? '对方请求添加您为好友',
    sender_uid: payload.sender_uid,
    actions: [
      { key: 'accept', label: '接受申请', variant: 'primary' },
      { key: 'reject', label: '拒绝申请', variant: 'secondary' },
    ],
  }
}

export const receiveNotice = async (data) => {
  const noticeData = data?.data
  const normalized = onFriendRequestNoticed(noticeData)
  if (!normalized) {
    console.log('通知消息暂不处理', noticeData)
    return
  }

  // 存储通知到 Store 和 IndexedDB
  const notificationStore = useNotificationStore()
  await notificationStore.addNotification(normalized)
  console.log('收到通知，已缓存并更新 Store', normalized)
}
