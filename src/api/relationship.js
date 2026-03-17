import instance from '@/utils/request'

export const sendFriendRequestAPI = (data) => {
  return instance.post('/relation/send-friend-request', data)
}
