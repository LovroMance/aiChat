import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThreadStore, useUnreadMessagesStore } from '@/stores'
import { initChatPanel, loadThreadChat } from '@/core/chatWorkflow'
import { groupCreate } from '@/api/chat'
import { putCreateGroupMessageRecord } from '@/core/unreadMessage'
import { showSuccessTip, showErrorTip } from '@/utils/messageTips'

/**
 * 聊天功能的组合式函数
 *
 * 提供：
 * - 初始化聊天面板
 * - 选择聊天线程
 * - 创建群聊
 * - 滚动到底部
 */
export function useChat() {
  const threadStore = useThreadStore()
  const unreadMessagesStore = useUnreadMessagesStore()
  const { activeThread } = storeToRefs(threadStore)
  const { sortedUnreadMessagesMap } = storeToRefs(unreadMessagesStore)

  const loading = ref(false)
  let chatPanelRef = null

  /**
   * 初始化聊天面板（应用启动时调用）
   */
  const initChat = async () => {
    try {
      await initChatPanel()
    } catch (error) {
      console.error('初始化聊天失败:', error)
    }
  }

  /**
   * 选择聊天线程
   * @param {Object} chat - 聊天对象
   */
  const selectThread = async (chat) => {
    // 防止重复点击同一个线程
    if (threadStore.activeThread?.thread_id === chat.thread_id) {
      return
    }

    loading.value = true
    try {
      // 更新活跃线程（通过 store 方法，保持 ref 不被覆盖）
      threadStore.setActiveThread(chat)

      // 加载聊天内容（Core 层编排）
      await loadThreadChat(chat.thread_id)
    } catch (error) {
      console.error('加载聊天失败:', error)
      showErrorTip('加载聊天失败，请重试')
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建群聊
   * @param {Object} groupForm - 群聊表单数据
   * @returns {Promise<boolean>} 是否创建成功
   */
  const createGroup = async (groupForm) => {
    try {
      const { data } = await groupCreate(groupForm)
      console.log('创建群聊成功:', data)

      const newGroupForm = {
        ...groupForm,
        thread_id: data.thread_id,
      }

      // 更新未读消息记录
      await putCreateGroupMessageRecord(newGroupForm)

      showSuccessTip('群聊创建成功！')
      return true
    } catch (error) {
      console.error('创建群聊失败:', error)
      showErrorTip('创建群聊失败，请重试')
      return false
    }
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    if (chatPanelRef) {
      chatPanelRef.scrollToBottom()
    }
  }

  /**
   * 设置聊天面板 ref（组件会传入）
   */
  const setChatPanelRef = (ref) => {
    chatPanelRef = ref
  }

  /**
   * 设置聊天面板加载状态
   */
  const setLoading = (value) => {
    loading.value = value
  }

  // 暴露给组件的接口
  return {
    // 状态
    loading,
    activeThread,
    unreadMessages: sortedUnreadMessagesMap,

    // 方法
    initChat,
    selectThread,
    createGroup,
    scrollToBottom,
    setChatPanelRef,
    setLoading,
  }
}
