import { defineStore } from 'pinia'
import { ref } from 'vue'
import { THREADS_STORE, getAllData } from '@/utils/indexedDB'

export const useThreadStore = defineStore('thread', () => {
  const threads = ref([
    {
      thread_id: '',
      avatar: '',
      description: '',
      name: '',
      type: '',
    },
  ])

  const loadThreadsFromDB = async () => {
    try {
      console.log('正在从 IndexedDB 加载线程数据...')

      // 获取所有线程数据
      const threadsDB = await getAllData(THREADS_STORE)

      // 清空现有的 Map
      threads.value.clear()

      // 将数据加载到 Map 中
      threadsDB.forEach((thread) => {
        if (thread.thread_id) {
          threads.value.set(thread.thread_id, thread)
        }
      })

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
    loadThreadsFromDB,
  }
})
