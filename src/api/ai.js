import instance from '@/utils/request'

export const createAiChat = (data) => {
  return instance.post('/api/thread/create/ai-chat', {
    name: data.name,
    init_settings: data.init_settings,
  })
}