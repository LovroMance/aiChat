import instance from '@/utils/request'

// 文件上传
export const useFileUpload = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return instance.post('/file/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getAllMessages = () => {
  return instance.get('/user/get_all_records', {
    params: {
      num: 30
    }
  })
}

export const getPartMessages = (data) => {
  return instance.get('/user/get_records', {
    params: {
      thread_id: data.thread_id,  // 会话id
      existing_id: data.existing_id,  // 已有消息id
      num: data.num  // 返回指定数量记录
    }
  })
}