import instance from '@/utils/request'

export const getDefaultChannel = () => {
  return instance.get('/api/debug/thread_info')
}
