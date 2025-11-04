import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UNREAD_MESSAGES_STORE, getAllData } from '@/utils/indexedDB'

export const useUnreadMessagesStore = defineStore('unreadMessages', () => {
  const unreadMessagesMap = ref(new Map())
  const sortedUnreadList = ref([]) // 排序后用于渲染
  const MAX_RECENT = 50

  // 解析各种 lastTime / update_time
  const parseToTs = (val) => {
    if (!val) return 0
    if (typeof val === 'number') return val
    const quick = Date.parse(val)
    if (!isNaN(quick)) return quick
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})\.?(\d{1,6})?$/)
    if (!m) return 0
    const [, Y, Mo, D, H, Mi, S, frac = '000'] = m
    const ms = frac.padEnd(3, '0').slice(0, 3)
    return new Date(+Y, +Mo - 1, +D, +H, +Mi, +S, +ms).getTime()
  }

  // 统一刷新排序列表
  const refreshSortedList = () => {
    const arr = Array.from(unreadMessagesMap.value.values())
    arr.forEach((item) => {
      item._ts = item._ts || parseToTs(item.lastTime || item.update_time)
    })
    arr.sort((a, b) => (b._ts || 0) - (a._ts || 0))
    sortedUnreadList.value = arr.slice(0, MAX_RECENT)
  }

  // 初始化用的结构模板（可选是否继续使用）
  // const valueObject = {
  //     thread_id: '',
  //     thread_name: '',
  //     thread_avatar: '',
  //     senderName: '',
  //     content: '',
  //     lastTime: '',
  //     unreadCount: 0,
  //     type: -1,
  //     _ts: 0
  // }

  // 从 IndexedDB 加载
  const loadUnreadMessagesFromDB = async () => {
    try {
      const unreadMessages = await getAllData(UNREAD_MESSAGES_STORE)
      unreadMessagesMap.value.clear()
      unreadMessages.forEach((message) => {
        if (!message.thread_id) return
        message._ts = parseToTs(message.lastTime || message.update_time)
        unreadMessagesMap.value.set(message.thread_id, message)
      })
      refreshSortedList()
      return unreadMessages
    } catch (error) {
      console.error('从 IndexedDB 加载未读消息失败:', error)
      throw error
    }
  }

  // 添加或更新
  const updateUnreadMessage = (threadId, messageData) => {
    if (!threadId || !messageData) return
    const old = unreadMessagesMap.value.get(threadId)
    const merged = { ...(old || {}), ...messageData }
    merged.lastTime =
      merged.lastTime || merged.update_time || merged.last_time || old?.lastTime || ''
    merged._ts = parseToTs(merged.lastTime)
    // 未读计数：如果外部没传且有旧值则自增
    if (messageData.unreadCount == null) {
      merged.unreadCount = old ? (old.unreadCount || 0) + 1 : 1
    }
    unreadMessagesMap.value.set(threadId, merged)
    refreshSortedList()
  }

  // 删除
  const removeUnreadMessage = (threadId) => {
    if (!threadId) return
    if (unreadMessagesMap.value.delete(threadId)) {
      refreshSortedList()
    }
  }

  // 清空
  const clearUnreadMessages = () => {
    unreadMessagesMap.value.clear()
    sortedUnreadList.value = []
  }

  // 标记已读
  const markThreadRead = (threadId) => {
    const obj = unreadMessagesMap.value.get(threadId)
    if (obj) {
      obj.unreadCount = 0
      // 不需要重新排序（时间未改变），但保持一致可刷新
      refreshSortedList()
    }
  }

  return {
    unreadMessagesMap,
    sortedUnreadList,
    loadUnreadMessagesFromDB,
    updateUnreadMessage,
    removeUnreadMessage,
    clearUnreadMessages,
    markThreadRead,
  }
})
