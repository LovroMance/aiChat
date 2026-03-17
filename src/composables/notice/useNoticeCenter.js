import { computed } from 'vue'
import { useNotificationStore } from '@/stores'

export function useNoticeCenter() {
  const notificationStore = useNotificationStore()

  const notifications = computed(() => notificationStore.notifications)

  const tabOptions = ['全部', '未读', '系统通知']

  const handleCardAction = async ({ actionKey, notification }) => {
    console.log('notification action', actionKey, notification.notice_id)

    // 根据具体业务可以调用接口
    // 处理完后从本地缓存中和 Store 中移除
  }

  return {
    notifications,
    tabOptions,
    handleCardAction,
  }
}
