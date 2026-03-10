import instance from '@/utils/request'

// 获取thread基本信息
export const getThreadInfo = (data) => {
  return instance.get('/thread/info/query', {
    params: {
      thread_id: data.thread_id,
    },
  })
}
