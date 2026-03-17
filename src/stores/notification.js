import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllData, putData, deleteData, NOTIFICATIONS_STORE } from '@/utils/indexedDB'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  // 初始化加载 IndexedDB 中的持久化通知
  const initNotifications = async () => {
    try {
      const data = await getAllData(NOTIFICATIONS_STORE)
      const allData = [...notifications.value, ...data]
      notifications.value = allData.sort((a, b) => {
        return b.created_time - a.created_time
      })
    } catch (error) {
      console.error('初始化通知数据失败:', error)
    }
  }

  // 接收到新通知（保存到 DB 并加入响应式列表）
  const addNotification = async (notification) => {
    try {
      await putData(NOTIFICATIONS_STORE, notification)
      notifications.value.unshift(notification)
    } catch (error) {
      console.error('添加并持久化通知失败:', error)
    }
  }

  // 消费/删除一条通知
  const removeNotification = async (noticeId) => {
    try {
      await deleteData(NOTIFICATIONS_STORE, noticeId)
      notifications.value = notifications.value.filter((n) => n.notice_id !== noticeId)
    } catch (error) {
      console.error('删除通知缓存失败:', error)
    }
  }

  // 未读通知数量（可选）
  const unreadCount = computed(() => notifications.value.length)

  return {
    notifications,
    initNotifications,
    addNotification,
    removeNotification,
    unreadCount,
  }
})
