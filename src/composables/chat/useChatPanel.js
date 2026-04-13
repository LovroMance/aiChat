import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useThreadStore } from '@/stores'
import { loadOlderThreadMessages } from '@/core/chatWorkflow'

const TOP_LOAD_THRESHOLD = 40

export function useChatPanel(messageStore) {
  const scrollbarRef = ref(null)
  const isLoading = ref(false)
  const threadStore = useThreadStore()
  let removeScrollListener = null

  const getWrap = () => scrollbarRef.value?.wrapRef || null

  const scrollToBottom = () => {
    nextTick(() => {
      const wrap = getWrap()
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight
      }
    })
  }

  const scrollToTop = () => {
    nextTick(() => {
      const wrap = getWrap()
      if (wrap) {
        wrap.scrollTop = 0
      }
    })
  }

  const setLoading = (val) => {
    isLoading.value = val
  }

  const keepViewportAnchor = async (loader) => {
    const wrap = getWrap()
    if (!wrap || typeof loader !== 'function') {
      return null
    }

    // 触顶加载前先记录滚动高度与当前位置，插入顶部消息后再把视口校正回来。
    const previousScrollHeight = wrap.scrollHeight
    const previousScrollTop = wrap.scrollTop
    const result = await loader()

    if (!result || result.count <= 0) {
      return result
    }

    await nextTick()
    const nextScrollHeight = wrap.scrollHeight
    wrap.scrollTop = nextScrollHeight - previousScrollHeight + previousScrollTop
    return result
  }

  const loadMoreHistory = async () => {
    const threadId = threadStore.activeThread?.thread_id
    if (!threadId) return null

    // 面板层只负责“触发加载 + 保持锚点”，具体分页策略下沉到 chatWorkflow。
    return keepViewportAnchor(() => loadOlderThreadMessages(threadId))
  }

  const handleScroll = async () => {
    const wrap = getWrap()
    if (!wrap || wrap.scrollTop > TOP_LOAD_THRESHOLD) return

    // 接近顶部时触发翻页，同时复用 store 里的分页状态做兜底判断。
    const status = messageStore.historyStatus
    if (status.loadingInitial || !status.hasMoreHistory) {
      return
    }

    await loadMoreHistory()
  }

  const bindScrollListener = () => {
    const wrap = getWrap()
    if (!wrap) return

    const listener = () => {
      handleScroll()
    }
    wrap.addEventListener('scroll', listener)
    removeScrollListener = () => {
      wrap.removeEventListener('scroll', listener)
      removeScrollListener = null
    }
  }

  onMounted(() => {
    nextTick(() => {
      bindScrollListener()
    })
  })

  onBeforeUnmount(() => {
    removeScrollListener?.()
  })

  watch(scrollbarRef, () => {
    removeScrollListener?.()
    nextTick(() => {
      bindScrollListener()
    })
  })

  watch(
    () => threadStore.activeThreadId,
    () => {
      // 切换会话后默认回到底部，保持聊天阅读习惯。
      nextTick(() => {
        const wrap = getWrap()
        if (wrap) {
          wrap.scrollTop = wrap.scrollHeight
        }
      })
    },
  )

  watch(
    () => messageStore.onlineMessages.length,
    () => {
      const wrap = getWrap()
      if (!wrap) return

      // 用户本来就停留在底部附近时，收到新消息才自动贴底，避免打断向上翻历史。
      const distanceToBottom = wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight
      if (distanceToBottom <= 120) {
        scrollToBottom()
      }
    },
  )

  return {
    scrollbarRef,
    isLoading,
    scrollToBottom,
    scrollToTop,
    setLoading,
    loadMoreHistory,
  }
}
