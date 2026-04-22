import { computed, ref } from 'vue'

const DEFAULT_ESTIMATED_ITEM_HEIGHT = 88
const DEFAULT_OVERSCAN = 8  // 可见区域外额外渲染 -- 预渲染缓冲区

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function useVirtualChatList(options) {
  const {
    messages,
    estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
    overscan = DEFAULT_OVERSCAN,
  } = options

  const scrollTop = ref(0)
  const viewportHeight = ref(0)
  const heightMap = ref(new Map())  // Map<item_id, height>
  const version = ref(0)
  const anchorSnapshot = ref(null)

  const getItemId = (item) => {
    return item?.item_id || item?.message_id || null
  }

  const getItemHeight = (item) => {
    const itemId = getItemId(item)
    if (!itemId) return estimatedItemHeight
    return heightMap.value.get(itemId) || item?.__virtual_height || estimatedItemHeight
  }

  const positions = computed(() => {
    version.value
    let offset = 0

    return (messages.value || []).filter(Boolean).map((item, index) => {
      const itemId = getItemId(item)
      const height = getItemHeight(item)
      const current = {
        index,
        item_id: itemId,
        top: offset,
        height,
        bottom: offset + height,
      }
      offset += height
      return current
    })
  })

  // 渲染列表中所有项的总高度，用于设置滚动容器的高度
  const totalHeight = computed(() => {
    const currentPositions = positions.value
    return currentPositions.length
      ? currentPositions[currentPositions.length - 1].bottom
      : 0
  })

  const startIndex = computed(() => {
    const currentPositions = positions.value
    if (!currentPositions.length) return 0

    const target = Math.max(scrollTop.value, 0)
    let low = 0
    let high = currentPositions.length - 1
    let answer = 0

    while (low <= high) {
      const middle = Math.floor((low + high) / 2)
      if (currentPositions[middle].bottom >= target) {
        answer = middle
        high = middle - 1
      } else {
        low = middle + 1
      }
    }

    return clamp(answer - overscan, 0, Math.max(currentPositions.length - 1, 0))
  })

  const endIndex = computed(() => {
    const currentPositions = positions.value
    if (!currentPositions.length) return 0

    const target = scrollTop.value + viewportHeight.value
    let low = 0
    let high = currentPositions.length - 1
    let answer = currentPositions.length - 1

    while (low <= high) {
      const middle = Math.floor((low + high) / 2)
      if (currentPositions[middle].top <= target) {
        answer = middle
        low = middle + 1
      } else {
        high = middle - 1
      }
    }

    return clamp(answer + overscan, 0, Math.max(currentPositions.length - 1, 0))
  })

  const visibleMessages = computed(() => {
    const source = (messages.value || []).filter(Boolean)
    if (!source.length) return []
    return source.slice(startIndex.value, endIndex.value + 1)
  })

  const topSpacerHeight = computed(() => {
    return positions.value[startIndex.value]?.top || 0
  })

  const bottomSpacerHeight = computed(() => {
    const currentPositions = positions.value
    if (!currentPositions.length) return 0
    const endPosition = currentPositions[endIndex.value]
    return endPosition ? Math.max(totalHeight.value - endPosition.bottom, 0) : 0
  })

  const updateViewport = ({ nextScrollTop, nextViewportHeight }) => {
    if (typeof nextScrollTop === 'number') {
      scrollTop.value = nextScrollTop
    }
    if (typeof nextViewportHeight === 'number') {
      viewportHeight.value = nextViewportHeight
    }
  }

  const measureItem = ({ item_id, message_id, height }) => {
    const targetId = item_id || message_id
    if (!targetId || typeof height !== 'number' || height <= 0) return
    if (heightMap.value.get(targetId) === height) return
    heightMap.value.set(targetId, height)
    version.value++
  }

  const clearMeasurements = () => {
    heightMap.value = new Map()
    version.value++
  }

  const findPosition = (item_id) => {
    return positions.value.find((item) => item.item_id === item_id) || null
  }

  const captureAnchor = () => {
    const firstVisibleItem = visibleMessages.value.find((item) => item?.item_type !== 'history-divider')
    if (!firstVisibleItem) {
      anchorSnapshot.value = null
      return null
    }

    const targetId = getItemId(firstVisibleItem)
    const position = findPosition(targetId)
    if (!position) {
      anchorSnapshot.value = null
      return null
    }

    anchorSnapshot.value = {
      item_id: targetId,
      offsetWithinViewport: scrollTop.value - position.top,
    }

    return anchorSnapshot.value
  }

  const restoreAnchor = (wrap) => {
    if (!wrap || !anchorSnapshot.value) return false

    const position = findPosition(anchorSnapshot.value.item_id)
    if (!position) {
      anchorSnapshot.value = null
      return false
    }

    wrap.scrollTop = position.top + anchorSnapshot.value.offsetWithinViewport
    scrollTop.value = wrap.scrollTop
    anchorSnapshot.value = null
    return true
  }

  return {
    scrollTop,
    viewportHeight,
    visibleMessages,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
    updateViewport,
    measureItem,
    clearMeasurements,
    captureAnchor,
    restoreAnchor,
  }
}
