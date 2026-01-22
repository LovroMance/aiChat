import { defineStore } from 'pinia'
import { ref } from 'vue'
import { THREADS_STORE, getAllData } from '@/utils/indexedDB'

export const useThreadStore = defineStore('thread', () => {
  const activeThread = ref(null) // 选中的聊天线程
  const threads = ref(new Map()) // thread_id -> 线程对象

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

  const setActiveThread = (thread) => {
    activeThread.value = thread || null
    console.log('eee', activeThread.value);
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
    activeThread,
    setThreads,
    upsertThread,
    setActiveThread,
    loadThreadsFromDB,
  }
})
