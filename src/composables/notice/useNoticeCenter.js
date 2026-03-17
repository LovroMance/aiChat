import { computed } from 'vue'
import { useNotificationStore } from '@/stores'
import { processFriendRequestAPI } from '@/api/relationship'
import { putAcceptFriendMessageRecord } from '@/core/unreadMessage'

export function useNoticeCenter() {
  const notificationStore = useNotificationStore()

  const notifications = computed(() => notificationStore.notifications)

  const tabOptions = ['全部', '未读', '系统通知']

  const handleCardAction = async ({ actionKey, notification }) => {
    console.log('notification action', actionKey, notification.notice_id)
    // 好友请求处理
    const action = actionKey === 'accept' ? 1 : 2
    try {
      const { data } = await processFriendRequestAPI({
        requester_uid: notification.sender_uid,
        action,
      })
      console.log('处理结果:', data)

      // 如果同意了请求，并且接口返回了 thread_id，则建立新的聊天列表项
      if (action === 1 && data?.data?.thread_id) {
        await putAcceptFriendMessageRecord(data.data.thread_id, notification)
      }

      // 成功后，将通知状态更新为已处理
      await notificationStore.updateNotificationStatus(notification.notice_id, action)
    } catch (error) {
      console.error('处理好友请求失败:', error)
    }
  }

  return {
    notifications,
    tabOptions,
    handleCardAction,
  }
}
