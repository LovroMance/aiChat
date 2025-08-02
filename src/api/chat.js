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