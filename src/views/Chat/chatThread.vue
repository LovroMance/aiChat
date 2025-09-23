<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { groupCreate } from '@/api/chat'

import { THREADS_STORE, addData } from '@/utils/indexedDB'
import { useThreadStore } from '@/stores'
const threadStore = useThreadStore()

// 定义 emits
const emit = defineEmits(['close', 'create'])

// 表单数据
const groupForm = ref({
  group_name: '',
  group_description: '',
  group_avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'  // 默认头像
})

// 表单验证规则
const rules = {
  group_name: [
    { required: true, message: '请输入群聊名称', trigger: 'blur' },
    { min: 2, max: 20, message: '群聊名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  group_description: [
    { max: 100, message: '群聊简介不能超过 100 个字符', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const selectedFile = ref(null) // 保存选择的文件对象

// 关闭弹窗
const closeDialog = () => {
  emit('close')
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 头像文件选择回调
const handleAvatarChange = (file) => {
  console.log('文件选择:', file)
  selectedFile.value = file.raw  // 保存文件对象
  groupForm.value.group_avatar = URL.createObjectURL(file.raw)  // 创建本地预览头像 URL
}

// 创建群聊
const createGroup = async () => {
  if (!formRef.value) return
  
  try {
    // 先进行表单验证
    const isValid = await formRef.value.validate()
    if (isValid) {
      // 调用创建群聊接口
      const { data } = await groupCreate(groupForm.value)
      console.log('创建群聊成功:', data)

      // 添加数据到indexedDB
      const threadObject = {
        thread_id: data.thread_id,
        avatar: groupForm.value.group_avatar,
        name: groupForm.value.group_name,
        type: 'group',
        description: groupForm.value.group_description,
      }
      await addData(THREADS_STORE, threadObject)  // 保存到indexedDB
      threadStore.threadObject = threadObject     // 保存到store
   
      emit('create')  // 发射创建事件，传递接口返回的数据
      ElMessage.success('群聊创建成功！')
    }
  } catch (error) {
    console.error('创建群聊失败:', error)
    ElMessage.error('创建群聊失败，请重试')
  }
}
</script>

<template>
  <div class="pop-up">
    <div class="dialog-container">
      <!-- 对话框头部 -->
      <div class="dialog-header">
        <h2>创建群聊</h2>
      </div>

      <!-- 对话框内容 -->
      <div class="dialog-content">
        <el-form 
          ref="formRef"
          :model="groupForm" 
          :rules="rules" 
          label-width="80px"
          class="group-form"
        >
          <!-- 群头像上传 -->
          <el-form-item label="群头像">
            <el-upload
              class="avatar-uploader"
              :auto-upload="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-change="handleAvatarChange"
            >
              <img v-if="groupForm.group_avatar" :src="groupForm.group_avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              <p>支持 JPG、PNG 格式，大小不超过 2MB</p>
              <p>不上传头像会有默认头像</p>
            </div>
          </el-form-item>

          <!-- 群聊名称 -->
          <el-form-item label="群名称" prop="group_name">
            <el-input 
              v-model="groupForm.group_name" 
              placeholder="请输入群聊名称"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <!-- 群聊简介 -->
          <el-form-item label="群简介" prop="group_description">
            <el-input 
              v-model="groupForm.group_description" 
              type="textarea"
              placeholder="请输入群聊简介（可选）"
              :rows="4"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 对话框底部 -->
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="createGroup">创建群聊</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  background: white;
  border-radius: 12px;
  width: 480px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 对话框头部 */
.dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(70, 130, 180, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(120deg, #f3fbfe 0%, #eafaf6 100%);
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

/* 对话框内容 */
.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.group-form {
  margin: 0;
}

/* 头像上传样式 */
.avatar-uploader {
  display: flex;
  justify-content: center;
}

:deep(.avatar-uploader .el-upload) {
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  margin-left: 16px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  line-height: 1.4;
}

/* 表单样式优化 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 1px rgba(70, 130, 180, 0.2);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);
}

:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid rgba(70, 130, 180, 0.2);
  transition: all 0.3s ease;
  resize: none;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 对话框底部 */
.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(70, 130, 180, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(248, 251, 255, 0.5);
}

:deep(.dialog-footer .el-button) {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.dialog-footer .el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #4dabf7 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

:deep(.dialog-footer .el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

:deep(.dialog-footer .el-button:not(.el-button--primary)) {
  border: 1px solid rgba(70, 130, 180, 0.2);
  color: #606266;
}

:deep(.dialog-footer .el-button:not(.el-button--primary):hover) {
  background-color: rgba(64, 158, 255, 0.05);
  border-color: #409eff;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dialog-container {
    width: 95vw;
    margin: 10px;
  }
  
  .dialog-header,
  .dialog-content,
  .dialog-footer {
    padding: 16px;
  }
}
</style>