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

export const getAllMessages = () => {
  return instance.get('/user/get_all_records', {
    params: {
      num: 30,
    },
  })
}

export const getPartMessages = (data) => {
  return instance.get('/user/get_records', {
    params: {
      thread_id: data.thread_id, // 会话id
      existing_id: data.existing_id, // 上次获取的最后一条消息id
      num: data.num,
    },
  })
}

export const threadJoin = (data) => {
  return instance.post('/thread/group/join', {
    uid: data.uid, // 用户id
    thread_id: data.thread_id, // 会话id
  })
}
