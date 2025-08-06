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

export const getPartMessages = (existing_id) => {
  return instance.get('/user/get_records', {
    params: {
      existing_id: existing_id
    }
  })
}