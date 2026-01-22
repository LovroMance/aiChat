<script setup>
import UploadAvatar from '@/components/file/uploadAvatar.vue'
import { useUserProfile } from '@/composables/user/useUserProfile'
import { Message, Postcard, Timer, User } from '@element-plus/icons-vue'

const { userInfo, editForm, isEditing, handleEdit, handleFileSelected, handleSave, handleCancel } =
  useUserProfile()
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 左侧：个人概览卡片 -->
      <div class="profile-card">
        <div class="card-header-bg"></div>
        <div class="profile-main">
          <div class="avatar-box">
            <div class="avatar-wrapper">
              <img v-if="!isEditing" :src="userInfo.avatar" class="avatar-img" />
              <UploadAvatar
                v-else
                v-model="userInfo.avatar"
                :size="100"
                @fileSelected="handleFileSelected"
                class="avatar-upload"
              />
            </div>
          </div>

          <h2 class="user-name">{{ userInfo.username }}</h2>
          <div class="user-tags">
            <span class="tag-level">Lv.{{ userInfo.level }}</span>
            <span class="tag-uid">UID: {{ userInfo.uid }}</span>
          </div>

          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-val">{{ userInfo.posts || 0 }}</span>
              <span class="stat-label">动态</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-val">{{ userInfo.followers || 0 }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-val">{{ userInfo.following || 0 }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>

          <div class="action-area">
            <el-button
              v-if="!isEditing"
              type="primary"
              class="action-btn"
              @click="handleEdit"
              plain
            >
              编辑资料
            </el-button>
            <div v-else class="edit-btns">
              <el-button class="btn-cancel" @click="handleCancel">取消</el-button>
              <el-button type="primary" class="btn-save" @click="handleSave">保存</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：详细资料表单 -->
      <div class="detail-card">
        <div class="detail-header">
          <h3>详细资料</h3>
          <span class="header-desc">查看或管理您的个人账户信息</span>
        </div>

        <div class="info-form">
          <!-- 账号 (只读) -->
          <div class="form-row">
            <div class="row-label">
              <el-icon><User /></el-icon>
              <span>账号</span>
            </div>
            <div class="row-content readonly">
              {{ userInfo.account }}
            </div>
          </div>

          <!-- 注册时间 (只读) -->
          <div class="form-row">
            <div class="row-label">
              <el-icon><Timer /></el-icon>
              <span>注册时间</span>
            </div>
            <div class="row-content readonly">
              {{ userInfo.create_time }}
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="form-row">
            <div class="row-label">
              <el-icon><Message /></el-icon>
              <span>邮箱</span>
            </div>
            <div class="row-content">
              <el-input v-if="isEditing" v-model="editForm.email" placeholder="填写您的邮箱地址" />
              <span v-else class="text-display">{{ userInfo.email || '未设置' }}</span>
            </div>
          </div>

          <!-- 个性签名 -->
          <div class="form-row align-top">
            <div class="row-label">
              <el-icon><Postcard /></el-icon>
              <span>个性签名</span>
            </div>
            <div class="row-content">
              <el-input
                v-if="isEditing"
                v-model="editForm.signature"
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="介绍一下自己..."
                maxlength="100"
                show-word-limit
              />
              <p v-else class="text-display signature">
                {{ userInfo.signature || '这个人很懒，什么都没有留下...' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器 */
.page-container {
  min-height: 100vh;
  background-color: #f2f3f5;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content-wrapper {
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  align-items: flex-start;
}

/* 左侧卡片 */
.profile-card {
  width: 320px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

.card-header-bg {
  height: 100px;
  background: linear-gradient(135deg, #8bc6ec 0%, #9599e2 100%);
}

.profile-main {
  padding: 0 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -50px;
}

.avatar-box {
  padding: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f2f5;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
}

.user-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-level {
  background: #fff7e6;
  color: #fa8c16;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tag-uid {
  background: #f2f3f5;
  color: #86909c;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.stats-row {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #f2f3f5;
  border-bottom: 1px solid #f2f3f5;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-val {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.stat-label {
  font-size: 12px;
  color: #86909c;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e5e6eb;
}

.action-area {
  width: 100%;
}

.action-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}

.edit-btns {
  display: flex;
  gap: 12px;
}

.edit-btns .el-button {
  flex: 1;
  height: 40px;
  border-radius: 20px;
}

/* 右侧卡片 */
.detail-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  min-height: 500px;
}

.detail-header {
  margin-bottom: 32px;
  border-bottom: 1px solid #f2f3f5;
  padding-bottom: 16px;
}

.detail-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px;
}

.header-desc {
  font-size: 14px;
  color: #86909c;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: flex;
  align-items: center;
  min-height: 40px; /* 保证高度一致，防止抖动 */
}

.form-row.align-top {
  align-items: flex-start;
}

.row-label {
  width: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4e5969;
  font-size: 14px;
  flex-shrink: 0;
}

.row-content {
  flex: 1;
  font-size: 14px;
  color: #1d2129;
  /* 关键：为文本状态提供与输入框一致的容器样式，防止跳动 */
  display: flex;
  align-items: center;
}

.row-content.readonly {
  color: #86909c;
}

.text-display {
  padding: 8px 11px; /* 模拟 el-input 的 padding */
  line-height: 1.5;
  border: 1px solid transparent; /* 占位边框 */
  width: 100%;
}

.text-display.signature {
  white-space: pre-wrap;
  background: #f7f8fa;
  border-radius: 4px;
  color: #4e5969;
}

/* 响应式 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .profile-card {
    width: 100%;
    position: static;
  }

  .detail-card {
    width: 100%;
    box-sizing: border-box;
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .row-label {
    width: 100%;
  }

  .row-content {
    width: 100%;
  }
}
</style>
