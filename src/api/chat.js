import instance from '@/utils/request'

// 文件上传
export const useFileUpload = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return instance.post('/file/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取离线记录
export const getPartMessages = (data) => {
  return instance.get('thread/record/get', {
    params: {
      thread_id: data.thread_id, // 会话id
      existing_id: data.existing_id, // 上次获取的最后一条消息id
      num: data.num,
    },
  })
}

// 创建群聊
export const groupCreate = (data) => {
  return instance.post('/thread/create/group', {
    group_name: data.group_name,
    group_description: data.group_description,
    group_avatar: data.group_avatar,
  })
}

// 加入群聊
export const threadJoin = (data) => {
  return instance.post('/thread/group/join', {
    uid: data.uid, // 用户id
    thread_id: data.thread_id, // 会话id
  })
}

// 拉取未读消息(拉取消息列表)
export const getUnreadMessages = (data) => {
  return instance.get('/thread/record/overview', {
    params: {
      existing_id: data.existing_id,
    }
  })
}
