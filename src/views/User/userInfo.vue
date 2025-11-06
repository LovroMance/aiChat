<script setup>
import { ref } from 'vue'
import { useFileUpload } from '@/api/chat'
import { baseURL } from '@/utils/request'

import { updateUserInfo } from '@/api/user'
import { USER_INFO_DATA, getStorage, setStorage } from '@/utils/localstorage'

import UploadAvatar from '@/components/file/uploadAvatar.vue'
// 获取用户个人资料信息
const userInfo = ref(getStorage(USER_INFO_DATA))
console.log('userInfo', userInfo.value)

const selectedFile = ref({}) // 保存选择的文件对象
const isEditing = ref(false) // 是否进入编辑状态
const recordAvatar = ref()  // 如果没保存修改，则恢复头像链接（内存）

// 编辑表单
const editForm = ref({
  email: userInfo.value.email,
  signature: userInfo.value.signature,
})

// 编辑处理逻辑
const handleEdit = () => {
  isEditing.value = true
  recordAvatar.value = userInfo.value.avatar
  editForm.value = {
    email: userInfo.value.email,
    signature: userInfo.value.signature,
  }
}

const handleFileSelected = (file) => {
  selectedFile.value = file
}

// 保存处理逻辑
const handleSave = async () => {
  console.log('保存')
  // 保存其他用户信息
  userInfo.value.signature = editForm.value.signature
  userInfo.value.email = editForm.value.email

  try {
    // 上传新头像
    if (selectedFile.value) {
      const res = await useFileUpload(selectedFile.value)
      console.log('头像上传结果:', res)
      console.log(res.data.data)
      userInfo.value.avatar = baseURL + '/' + res.data.data
      console.log('userInfo.value.avatar', userInfo.value.avatar)
    }
    // 更新本地存储
    setStorage(USER_INFO_DATA, userInfo.value)
    // 更新服务器数据
    const { data } = await updateUserInfo(userInfo.value)
    console.log('更新用户信息结果:', data)
  } catch (error) {
    console.error('头像上传失败:', error)
  }
  isEditing.value = false
  selectedFile.value = null // 重置选择的文件
}

const handleCancel = () => {
  isEditing.value = false
  selectedFile.value = null // 清除选择的文件
  userInfo.value.avatar = recordAvatar.value
}
</script>

<template>
  <div class="user-info-container">
    <!-- 背景装饰 -->
    <div class="background-decoration"></div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 用户头像和基本信息卡片 -->
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="userInfo.avatar" alt="用户头像" class="avatar" v-if="!isEditing" />
            <UploadAvatar v-if="isEditing" v-model="userInfo.avatar" :size="100" @fileSelected="handleFileSelected"></UploadAvatar>
            <div
              class="status-indicator"
              :class="userInfo.status === 0 ? 'online' : 'offline'"
            ></div>
          </div>
          <div class="user-basic-info">
            <h1 class="username">{{ userInfo.username }}</h1>
            <div class="user-level">Lv.{{ userInfo.level }}</div>
            <div class="user-status">{{ userInfo.status === 0 ? '在线' : '离线' }}</div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="edit-btn" @click="handleEdit" v-if="!isEditing">
            <i class="edit-icon">✏️</i>
            编辑资料
          </button>
          <div class="save-cancel-buttons" v-if="isEditing">
            <button class="save-btn" @click="handleSave">保存</button>
            <button class="cancel-btn" @click="handleCancel">取消</button>
          </div>
        </div>
      </div>

      <!-- 详细信息卡片 -->
      <div class="details-card">
        <h2 class="section-title">个人信息</h2>

        <div class="info-grid">
          <!-- 账号 -->
          <div class="info-item">
            <label class="info-label">账号</label>
            <div class="info-value">{{ userInfo.account }}</div>
          </div>

          <!-- 注册时间 -->
          <div class="info-item">
            <label class="info-label">注册时间</label>
            <div class="info-value">{{ userInfo.create_time }}</div>
          </div>

          <!-- 最后登录 -->
          <div class="info-item">
            <label class="info-label">最后登录</label>
            <div class="info-value">{{ userInfo.last_login_time }}</div>
          </div>

          <!-- 邮箱 -->
          <div class="info-item full-width">
            <label class="info-label">邮箱</label>
            <div class="info-value" v-if="!isEditing">{{ userInfo.email }}</div>
            <input v-else v-model="editForm.email" class="edit-input" type="email" />
          </div>

          <!-- 个性签名 -->
          <div class="info-item full-width">
            <label class="info-label">个性签名</label>
            <div class="info-value signature-text" v-if="!isEditing">{{ userInfo.signature }}</div>
            <textarea v-else v-model="editForm.signature" class="edit-textarea" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- 统计数据卡片 -->
      <div class="stats-card">
        <h2 class="section-title">数据统计</h2>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ userInfo.posts }}</div>
            <div class="stat-label">发布</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ userInfo.followers }}</div>
            <div class="stat-label">粉丝</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ userInfo.following }}</div>
            <div class="stat-label">关注</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-info-container {
  height: 100vh;
  background: linear-gradient(135deg, #f3fbfe 0%, #eafaf6 50%, #e8f4fd 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%);
  border-bottom: 1px solid rgba(70, 130, 180, 0.1);
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 个人资料卡片 */
.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(70, 130, 180, 0.1);
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  flex-shrink: 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.avatar-container {
  width: 100px;
  height: 100px;
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

/* TODO */
.avatar-upload-wrapper {
  display: inline-block;
  width: 100px;
  height: 100px;
  position: relative;
}

.avatar-upload-wrapper :deep(.el-upload) {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: none !important;
  border-radius: 50% !important;
  overflow: hidden !important;
}

.avatar-upload-wrapper :deep(.el-upload img) {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50% !important;
  object-fit: cover !important;
  border: 4px solid #f0f8ff !important;
  box-shadow: 0 4px 16px rgba(70, 130, 180, 0.15) !important;
  max-width: none !important;
  max-height: none !important;
  min-width: 100px !important;
  min-height: 100px !important;
}

/* 确保 el-upload 的所有子元素都保持圆形 */
.avatar-upload-wrapper :deep(.el-upload *) {
  border-radius: 50% !important;
}

/* 强制覆盖任何可能的样式 */
.avatar-upload-wrapper :deep(.el-upload) img {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50% !important;
  object-fit: cover !important;
  border: 4px solid #f0f8ff !important;
  box-shadow: 0 4px 16px rgba(70, 130, 180, 0.15) !important;
  max-width: 100px !important;
  max-height: 100px !important;
  min-width: 100px !important;
  min-height: 100px !important;
  flex-shrink: 0 !important;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.status-indicator {
  position: absolute;
  bottom: 7px;
  right: 7px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 3px solid white;
  z-index: 10;
  pointer-events: none;
}

.status-indicator.online {
  background: #52c41a;
}

.status-indicator.offline {
  background: #d9d9d9;
}

.user-basic-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.5px;
}

.user-level {
  background: linear-gradient(90deg, #6b7b8a 0%, #545c64 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
}

.user-status {
  color: #6b7b8a;
  font-size: 1rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.edit-btn,
.save-btn,
.cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  background: linear-gradient(90deg, #6b7b8a 0%, #545c64 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(107, 123, 138, 0.2);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 123, 138, 0.3);
}

.save-btn {
  background: #52c41a;
  color: white;
}

.save-btn:hover {
  background: #389e0d;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

.cancel-btn:hover {
  background: #e6e6e6;
}

.save-cancel-buttons {
  display: flex;
  gap: 12px;
}

/* 详细信息卡片 */
.details-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(70, 130, 180, 0.1);
  padding: 30px;
  flex: 1;
  min-height: 0;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f8ff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7b8a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  height: 51.33px;
}

.signature-text {
  font-style: italic;
  color: #6b7b8a;
  background: #f0f8ff;
  border: 1px solid #e8f4fd;
}

.edit-input,
.edit-textarea {
  padding: 12px 16px;
  border: 2px solid #e8f4fd;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #2c3e50;
  background: white;
  transition: border-color 0.3s ease;
}

.edit-input:focus,
.edit-textarea:focus {
  outline: none;
  border-color: #6b7b8a;
}

.edit-textarea {
  resize: none;
  min-height: 51.33px;
  max-height: 51.33px;
}

/* 统计数据卡片 */
.stats-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(70, 130, 180, 0.1);
  padding: 30px;
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%);
  border-radius: 16px;
  border: 1px solid rgba(70, 130, 180, 0.1);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #6b7b8a;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 1rem;
  color: #6b7b8a;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 15px 10px;
  }

  .profile-card {
    padding: 20px 15px;
    flex-direction: column;
    text-align: center;
  }

  .avatar-section {
    flex-direction: column;
    gap: 12px;
  }

  .username {
    font-size: 1.8rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .stat-item {
    padding: 15px;
  }

  .stat-number {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .save-cancel-buttons {
    flex-direction: column;
    width: 100%;
  }

  .edit-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    padding: 10px 5px;
  }

  .profile-card,
  .details-card,
  .stats-card {
    padding: 15px 10px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
