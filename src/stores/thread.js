import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { THREADS_STORE, getAllData } from '@/utils/indexedDB'

export const useThreadStore = defineStore('thread', () => {
  const threads = ref(new Map()) // thread_id -> 线程对象
  const activeThreadId = ref(null) // 当前选中线程 id
  const activeThread = computed(() => {
    if (!activeThreadId.value) return null
    return threads.value.get(activeThreadId.value) || null
  })

  const setThreads = (list) => {
    threads.value = new Map()
    if (!Array.isArray(list)) return
    list.forEach((thread) => {
      if (thread?.thread_id) {
        threads.value.set(thread.thread_id, thread)
      }
    })
  }

  const upsertThread = (thread) => {
    if (!thread?.thread_id) return
    threads.value.set(thread.thread_id, thread)
  }

  const setActiveThreadId = (threadId) => {
    activeThreadId.value = threadId || null
  }

  const setActiveThread = (thread) => {
    if (!thread?.thread_id) {
      activeThreadId.value = null
      return
    }
    threads.value.set(thread.thread_id, thread)
    activeThreadId.value = thread.thread_id
  }

  const loadThreadsFromDB = async () => {
    try {
      console.log('正在从 IndexedDB 加载线程数据...')
      const threadsDB = await getAllData(THREADS_STORE)
      setThreads(threadsDB)
      console.log(`成功加载 ${threadsDB.length} 个线程到 store 中`)
      console.log('threadsMap:', threads.value)
      return threads
    } catch (error) {
      console.error('从 IndexedDB 加载线程数据失败:', error)
      throw error
    }
  }

  return {
    threads,
    activeThreadId,
    activeThread,
    setThreads,
    upsertThread,
    setActiveThreadId,
    setActiveThread,
    loadThreadsFromDB,
  }
})
