import { ref } from 'vue'
import { useFileUpload } from '@/api/chat'
import { baseURL } from '@/utils/request'
import { updateUserInfo } from '@/api/user'
import { USER_INFO_DATA, getStorage, setStorage } from '@/utils/localstorage'
import { ElMessage } from 'element-plus'

/**
 * 用户资料管理的组合式函数
 * 负责：编辑模式切换、头像上传、资料保存/回滚
 */
export function useUserProfile() {
  const userInfo = ref(getStorage(USER_INFO_DATA) || {})
  const selectedFile = ref(null)
  const isEditing = ref(false)
  const recordAvatar = ref('')

  const editForm = ref({
    email: userInfo.value.email || '',
    signature: userInfo.value.signature || '',
    phone: userInfo.value.phone || '',
    location: userInfo.value.location || '',
  })

  const syncFormFromUser = () => {
    editForm.value = {
      email: userInfo.value.email || '',
      signature: userInfo.value.signature || '',
      phone: userInfo.value.phone || '',
      location: userInfo.value.location || '',
    }
  }

  const handleEdit = () => {
    isEditing.value = true
    recordAvatar.value = userInfo.value.avatar
    syncFormFromUser()
  }

  const handleFileSelected = (file) => {
    // el-upload 触发 file.raw，手动选择时可能直接是 file 对象
    selectedFile.value = file?.raw ?? file ?? null
  }

  const handleSave = async () => {
    // 乐观更新
    userInfo.value = {
      ...userInfo.value,
      signature: editForm.value.signature,
      email: editForm.value.email,
      phone: editForm.value.phone,
      location: editForm.value.location,
    }

    try {
      if (selectedFile.value) {
        const res = await useFileUpload(selectedFile.value)
        userInfo.value.avatar = `${baseURL}/${res.data.data}`
      }

      setStorage(USER_INFO_DATA, userInfo.value)
      await updateUserInfo(userInfo.value)
      ElMessage.success('个人资料已更新')
    } catch (error) {
      console.error('保存失败:', error)
      if (!error?.__handledByInterceptor) {
        ElMessage.error('保存失败，请重试')
      }
    } finally {
      isEditing.value = false
      selectedFile.value = null
    }
  }

  const handleCancel = () => {
    isEditing.value = false
    selectedFile.value = null
    userInfo.value.avatar = recordAvatar.value
    syncFormFromUser()
  }

  return {
    userInfo,
    editForm,
    isEditing,
    selectedFile,
    handleEdit,
    handleFileSelected,
    handleSave,
    handleCancel,
  }
}
