<script setup>
import { ref, onMounted } from 'vue'

// 模拟用户数据，实际应该从API获取
const userInfo = ref({
  username: '用户名',
  nickname: '昵称',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  signature: '这个人很懒，什么都没有留下...',
  email: 'user@example.com',
  createTime: '2024-01-01',
  lastLoginTime: '2024-01-15 14:30:00',
  status: '在线',
  level: 'Lv.5',
  posts: 128,
  followers: 256,
  following: 64
})

const isEditing = ref(false)
const editForm = ref({
  nickname: userInfo.value.nickname,
  signature: userInfo.value.signature,
  email: userInfo.value.email
})

const handleEdit = () => {
  isEditing.value = true
  editForm.value = {
    nickname: userInfo.value.nickname,
    signature: userInfo.value.signature,
    email: userInfo.value.email
  }
}

const handleSave = () => {
  // 这里应该调用API保存用户信息
  userInfo.value.nickname = editForm.value.nickname
  userInfo.value.signature = editForm.value.signature
  userInfo.value.email = editForm.value.email
  isEditing.value = false
}

const handleCancel = () => {
  isEditing.value = false
}

onMounted(() => {
  // 这里应该从API获取用户信息
  console.log('加载用户信息')
})
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
            <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
            <div class="status-indicator" :class="userInfo.status === '在线' ? 'online' : 'offline'"></div>
          </div>
          <div class="user-basic-info">
            <h1 class="username">{{ userInfo.username }}</h1>
            <div class="user-level">{{ userInfo.level }}</div>
            <div class="user-status">{{ userInfo.status }}</div>
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
          <!-- 昵称 -->
          <div class="info-item">
            <label class="info-label">昵称</label>
            <div class="info-value" v-if="!isEditing">{{ userInfo.nickname }}</div>
            <input v-else v-model="editForm.nickname" class="edit-input" type="text" />
          </div>

          <!-- 个性签名 -->
          <div class="info-item full-width">
            <label class="info-label">个性签名</label>
            <div class="info-value signature-text" v-if="!isEditing">{{ userInfo.signature }}</div>
            <textarea v-else v-model="editForm.signature" class="edit-textarea" rows="3"></textarea>
          </div>

          <!-- 邮箱 -->
          <div class="info-item">
            <label class="info-label">邮箱</label>
            <div class="info-value" v-if="!isEditing">{{ userInfo.email }}</div>
            <input v-else v-model="editForm.email" class="edit-input" type="email" />
          </div>

          <!-- 注册时间 -->
          <div class="info-item">
            <label class="info-label">注册时间</label>
            <div class="info-value">{{ userInfo.createTime }}</div>
          </div>

          <!-- 最后登录 -->
          <div class="info-item">
            <label class="info-label">最后登录</label>
            <div class="info-value">{{ userInfo.lastLoginTime }}</div>
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
  width: 100vw;
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
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f8ff;
  box-shadow: 0 4px 16px rgba(70, 130, 180, 0.15);
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
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

.edit-btn, .save-btn, .cancel-btn {
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
}

.signature-text {
  font-style: italic;
  color: #6b7b8a;
  background: #f0f8ff;
  border: 1px solid #e8f4fd;
}

.edit-input, .edit-textarea {
  padding: 12px 16px;
  border: 2px solid #e8f4fd;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #2c3e50;
  background: white;
  transition: border-color 0.3s ease;
}

.edit-input:focus, .edit-textarea:focus {
  outline: none;
  border-color: #6b7b8a;
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
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
  
  .edit-btn, .save-btn, .cancel-btn {
    width: 100%;
    justify-content: center;
  }
  
  .main-content {
    padding: 10px 5px;
  }
  
  .profile-card, .details-card, .stats-card {
    padding: 15px 10px;
  }
}
</style>