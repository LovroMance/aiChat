import instance from '@/utils/request'

export const getDefaultChannel = (data) => {
  return instance.post('/thread/create/ai-chat', {
    name: data.name,
    init_settings: data.init_settings,
    avatar: data.avatar
  })
}