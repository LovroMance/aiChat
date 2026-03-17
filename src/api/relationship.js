import instance from '@/utils/request'

// 发送好友申请
export const sendFriendRequestAPI = (data) => {
  return instance.post('/relation/send-friend-request', data)
}

// 处理好友申请
export const processFriendRequestAPI = (data) => {
  return instance.post('/relation/process-friend-request', data)
}
