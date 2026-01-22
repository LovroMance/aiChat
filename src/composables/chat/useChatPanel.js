import { nextTick, ref, watch } from 'vue'

/**
 * 聊天面板的滚动与加载状态封装
 * 负责：滚动控制、加载态、消息变更自动滚动
 * @param {Object} messageStore - 消息 store，需包含 onlineMessages
 */
export function useChatPanel(messageStore) {
  const scrollbarRef = ref(null)
  const isLoading = ref(false)

  const scrollToBottom = () => {
    nextTick(() => {
      const wrap = scrollbarRef.value?.wrapRef
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight
      }
    })
  }

  const scrollToTop = () => {
    nextTick(() => {
      const wrap = scrollbarRef.value?.wrapRef
      if (wrap) {
        wrap.scrollTop = 0
      }
    })
  }

  const setLoading = (val) => {
    isLoading.value = val
  }

  // 在线消息变化时自动滚动到底部
  watch(
    () => messageStore.onlineMessages.length,
    () => {
      scrollToBottom()
    },
  )

  return {
    scrollbarRef,
    isLoading,
    scrollToBottom,
    scrollToTop,
    setLoading,
  }
}
