import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useThreadStore } from '@/stores'
import { loadOlderThreadMessages } from '@/core/chatWorkflow'

const TOP_LOAD_THRESHOLD = 40

export function useChatPanel(messageStore, virtualList, onlineMessageCount) {
  const scrollbarRef = ref(null)
  const isLoading = ref(false)
  const isLoadingMoreHistory = ref(false)
  const shouldStickBottom = ref(true)
  const threadStore = useThreadStore()
  let removeScrollListener = null

  const getWrap = () => scrollbarRef.value?.wrapRef || null

  const scrollToBottom = () => {
    nextTick(() => {
      const wrap = getWrap()
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight
        virtualList?.updateViewport({
          nextScrollTop: wrap.scrollTop,
          nextViewportHeight: wrap.clientHeight,
        })
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

    virtualList?.captureAnchor()
    const result = await loader()

    if (!result || result.count <= 0) {
      return result
    }

    await nextTick()
    virtualList?.restoreAnchor(wrap)
    return result
  }

  const loadMoreHistory = async () => {
    const threadId = threadStore.activeThread?.thread_id
    if (!threadId || isLoadingMoreHistory.value) return null

    isLoadingMoreHistory.value = true
    try {
      // 面板层只负责“触发加载 + 保持锚点”，具体分页策略下沉到 chatWorkflow。
      return await keepViewportAnchor(() => loadOlderThreadMessages(threadId))
    } finally {
      isLoadingMoreHistory.value = false
    }
  }

  const handleScroll = async () => {
    const wrap = getWrap()
    if (!wrap) return

    shouldStickBottom.value =
      wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight <= 120

    virtualList?.updateViewport({
      nextScrollTop: wrap.scrollTop,
      nextViewportHeight: wrap.clientHeight,
    })

    if (wrap.scrollTop > TOP_LOAD_THRESHOLD) return

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

    virtualList?.updateViewport({
      nextScrollTop: wrap.scrollTop,
      nextViewportHeight: wrap.clientHeight,
    })

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
      shouldStickBottom.value = true
      // 切换会话后默认回到底部，保持聊天阅读习惯。
      nextTick(() => {
        const wrap = getWrap()
        if (wrap) {
          wrap.scrollTop = wrap.scrollHeight
          virtualList?.updateViewport({
            nextScrollTop: wrap.scrollTop,
            nextViewportHeight: wrap.clientHeight,
          })
        }
      })
    },
  )

  watch(
    () => onlineMessageCount?.value,
    () => {
      const wrap = getWrap()
      if (!wrap) return

      // 用户本来就停留在底部附近时，收到新消息才自动贴底，避免打断向上翻历史。
      if (shouldStickBottom.value) {
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
