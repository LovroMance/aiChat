import instance from '@/utils/request'

export const sendFriendRequest = (data) => {
  return instance.post('/relation/send-friend-request', data)
}
