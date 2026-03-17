<script setup>
import { Plus, Search, UserFilled } from '@element-plus/icons-vue'
import { useContactList } from '@/composables/user/useContactList'
import { useAddUserProfileCard } from '@/composables/user/addUserProfileCard'

const {
  contacts,
  query,
  activeTab,
  tabs,
  filteredContacts,
  activeLabel,
  openChat,
  typeBadgeText,
  typeIcon,
} = useContactList()

const { profileCards, searchUserProfile, sendFriendRequest } = useAddUserProfileCard()
</script>

<template>
  <div class="contact-page">
    <!-- 添加联系人区域 -->
    <section class="add-contact">
      <div class="add-inner">
        <h2 class="title">添加联系人</h2>
        <p class="subtitle">搜索用户 / 群聊 / AI 机器人，按 Enter 或点击右侧按钮</p>
        <div class="search-row">
          <el-input
            v-model="query"
            placeholder="输入用户名、群名称、关键字"
            clearable
            @keyup.enter="searchUserProfile({ account: query })"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="!query.trim()"
            @click="searchUserProfile({ account: query })"
            class="search-btn"
          >
            <el-icon><Plus /></el-icon>
            <span>搜索 / 添加</span>
          </el-button>
        </div>
        <div class="tabs">
          <div
            v-for="t in tabs"
            :key="t.key"
            :class="['tab', { active: activeTab === t.key }]"
            @click="activeTab = t.key"
          >
            {{ t.label }}
            <span v-if="t.key === 'all'" class="count">{{ contacts.length }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- User Profile Card -->
    <section v-if="query.trim() && profileCards.length" class="profile-section">
      <div class="profile-grid">
        <article
          v-for="(card, idx) in profileCards || []"
          :key="card?.account || card?.name || idx"
          class="profile-card"
        >
          <div class="profile-shell">
            <div class="profile-info">
              <el-avatar :size="64" :src="card.avatar" class="profile-avatar" />
              <div class="profile-text">
                <h3 class="profile-name">{{ card.username }}</h3>
                <p class="profile-account">账号：{{ card.account }}</p>
                <p class="profile-signature">
                  个性签名：{{ card.signature || '这个人很懒，什么都没有留下' }}
                </p>
              </div>
            </div>

            <div class="profile-states">
              <div class="request-panel">
                <div class="greeting-input-area">
                  <textarea
                    class="greeting-text"
                    v-model="card.message"
                    placeholder="你好，很高兴认识你~"
                  ></textarea>
                </div>
                <button
                  type="button"
                  class="state-button"
                  @click="sendFriendRequest({ acceptor_uid: card.uid, message: card.message })"
                >
                  添加好友
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- 联系人列表 -->
    <section v-else class="list-section">
      <div class="list-header">
        <h3>{{ activeLabel }}（{{ filteredContacts.length }}）</h3>
      </div>
      <el-scrollbar class="contact-scroll">
        <ul class="contact-list">
          <li v-for="c in filteredContacts" :key="c.id" class="contact-item" @click="openChat(c)">
            <div class="avatar-wrap">
              <el-avatar :size="48" :src="c.avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="type-badge" :data-type="c.type">
                <el-icon :size="12"><component :is="typeIcon(c.type)" /></el-icon>
              </span>
              <span v-if="c.unread" class="unread">{{ c.unread > 99 ? '99+' : c.unread }}</span>
            </div>
            <div class="meta">
              <div class="row top">
                <span class="name">{{ c.name }}</span>
                <span class="time">{{ c.lastTime }}</span>
              </div>
              <div class="row bottom">
                <span class="last-msg">{{ c.lastMessage }}</span>
                <span class="badge-text">{{ typeBadgeText(c.type) }}</span>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="filteredContacts.length === 0" class="empty">
          <el-icon :size="36" class="empty-icon"><Search /></el-icon>
          <p class="empty-text">暂无结果</p>
          <p class="empty-hint">尝试更换关键词或清除筛选</p>
        </div>
      </el-scrollbar>
    </section>
  </div>
</template>

<style scoped>
/* 布局骨架 */
.contact-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fbff 0%, #eef6ff 35%, #eaf9f6 70%, #f2f8ff 100%);
  box-sizing: border-box;
  padding: 16px 20px 20px;
  gap: 16px;
}

/* 顶部添加联系人区域 */
.add-contact {
  display: flex;
  flex-shrink: 0;
}

.add-inner {
  width: 100%;
  background: linear-gradient(160deg, #ffffff 0%, #f6faff 100%);
  border: 1px solid rgba(70, 130, 180, 0.15);
  border-radius: 20px;
  padding: 28px 28px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 18px -10px rgba(64, 158, 255, 0.15);
  transition: box-shadow 0.3s ease;
}

.add-inner:hover {
  box-shadow: 0 12px 28px -12px rgba(64, 158, 255, 0.22);
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 6px 0 18px;
  font-size: 13px;
  color: #606266;
}

/* 搜索行 */
.search-row {
  display: flex;
  gap: 14px;
  align-items: stretch;
  margin-bottom: 16px;
}

.search-row :deep(.el-input__wrapper) {
  background: #fff;
  border: 1px solid rgba(70, 130, 180, 0.18);
  box-shadow: none;
  transition: all 0.25s ease;
  height: 46px;
}

.search-row :deep(.el-input__wrapper:hover) {
  border-color: rgba(64, 158, 255, 0.4);
  box-shadow: 0 4px 12px -6px rgba(64, 158, 255, 0.25);
}

.search-row :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.search-row :deep(.el-input__inner) {
  color: #2c3e50;
  font-size: 14px;
}

.search-btn {
  padding: 0 22px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 46px;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  border: 1px solid rgba(64, 158, 255, 0.5);
  box-shadow: 0 6px 16px -8px rgba(64, 158, 255, 0.3);
  transition: all 0.25s ease;
}

.search-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px -12px rgba(64, 158, 255, 0.35);
}

.search-btn:disabled {
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.4), rgba(102, 177, 255, 0.4));
  border-color: rgba(64, 158, 255, 0.25);
  transform: none;
  box-shadow: none;
}

/* 筛选标签 */
.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab {
  font-size: 13px;
  padding: 6px 14px;
  background: #f3f7fb;
  border: 1px solid rgba(70, 130, 180, 0.15);
  border-radius: 16px;
  cursor: pointer;
  color: #606266;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.25s ease;
  user-select: none;
}

.tab:hover {
  background: #e8f4fd;
  color: #409eff;
  border-color: rgba(64, 158, 255, 0.35);
}

.tab.active {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  border-color: rgba(64, 158, 255, 0.6);
  box-shadow: 0 6px 18px -10px rgba(64, 158, 255, 0.32);
}

.count {
  background: rgba(255, 255, 255, 0.28);
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 18px;
}

/* 下方列表区域 */
.list-section {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffffcc;
  backdrop-filter: blur(2px);
  border: 1px solid rgba(70, 130, 180, 0.12);
  border-radius: 16px;
  padding: 12px 0 4px;
  box-shadow: 0 4px 14px -8px rgba(64, 158, 255, 0.18);
}

/* tTcHo: User Profile Card */
.profile-section {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  background: linear-gradient(135deg, #f8fafc 0%, #eef4ff 100%);
  border: 1px solid rgba(37, 99, 235, 0.15);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 28px -18px rgba(30, 58, 95, 0.35);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.profile-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-card {
  background: #ffffff;
  border: 1px solid rgba(70, 130, 180, 0.15);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.profile-card:hover {
  border-color: rgba(64, 158, 255, 0.4);
  box-shadow: 0 8px 20px -8px rgba(64, 158, 255, 0.15);
}

.profile-shell {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;
}

.profile-avatar {
  border: 2px solid #fff;
  box-shadow: 0 4px 10px -4px rgba(30, 58, 95, 0.2);
  flex-shrink: 0;
}

.profile-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.profile-account {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.profile-signature {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-states {
  width: 280px;
  flex-shrink: 0;
}

.request-panel {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.greeting-input-area {
  height: 48px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
}

.greeting-input-area:focus-within {
  border-color: #60a5fa;
}

.greeting-text {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  font-family: inherit;
}

.greeting-text::placeholder {
  color: #94a3b8;
}

.state-button {
  width: 100%;
  height: 38px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #3b82f6;
  transition: all 0.2s ease;
}

.state-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.state-button:active {
  background: #1d4ed8;
  transform: scale(0.99);
}

.list-header {
  padding: 0 20px 8px;
  border-bottom: 1px solid rgba(70, 130, 180, 0.12);
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.contact-scroll {
  flex: 1;
  padding: 4px 4px 10px;
}

.contact-list {
  list-style: none;
  margin: 0;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  background: linear-gradient(160deg, #ffffff 0%, #f6faff 100%);
  border: 1px solid rgba(70, 130, 180, 0.14);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.contact-item:hover {
  border-color: rgba(64, 158, 255, 0.45);
  box-shadow: 0 10px 24px -12px rgba(64, 158, 255, 0.28);
  transform: translateY(-4px);
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar-wrap :deep(.el-avatar) {
  background: #fff;
  border: 2px solid rgba(70, 130, 180, 0.15);
  transition: border-color 0.25s ease;
}

.contact-item:hover .avatar-wrap :deep(.el-avatar) {
  border-color: rgba(64, 158, 255, 0.45);
}

.type-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px -2px rgba(64, 158, 255, 0.4);
}

.type-badge[data-type='group'] {
  background: #8e7ef1;
}
.type-badge[data-type='friend'] {
  background: #67c23a;
}
.type-badge[data-type='ai'] {
  background: #e6a23c;
}

.unread {
  position: absolute;
  top: -4px;
  left: -6px;
  background: linear-gradient(45deg, #ff6d6d, #ff4e4e);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 8px -4px rgba(255, 90, 90, 0.4);
}

.meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.row.top {
  justify-content: space-between;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 12px;
}

.row.bottom {
  justify-content: space-between;
  gap: 12px;
}

.last-msg {
  font-size: 13px;
  color: #606266;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.badge-text {
  flex-shrink: 0;
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f6fb;
  border: 1px solid rgba(70, 130, 180, 0.18);
  border-radius: 12px;
  color: #4a6b86;
  letter-spacing: 0.5px;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 60px 0 40px;
  color: #606266;
}

.empty-icon {
  color: #90b7d9;
  margin-bottom: 12px;
}

.empty-text {
  margin: 0 0 6px;
  font-weight: 600;
  font-size: 15px;
}

.empty-hint {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

/* 滚动条微调（可选） */
:deep(.el-scrollbar__bar.is-vertical > div) {
  background: rgba(70, 130, 180, 0.25);
}
:deep(.el-scrollbar__thumb) {
  background-color: rgba(64, 158, 255, 0.35);
}

/* 响应式 */
@media (max-width: 860px) {
  .add-contact {
    flex: 0 0 38%;
  }
  .search-row {
    flex-direction: column;
  }
  .search-btn {
    width: 100%;
  }
  .profile-section {
    padding: 24px;
  }
  .profile-grid {
    gap: 12px;
  }
  .profile-card {
    min-height: 0;
    padding: 20px;
  }
  .profile-shell {
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-states {
    width: 100%;
    max-width: none;
  }
  .state-button {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .contact-page {
    padding: 12px 14px;
  }
  .add-inner {
    padding: 22px 20px 16px;
  }
  .profile-info {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
  .profile-name {
    font-size: 30px;
  }
  .profile-account {
    font-size: 16px;
  }
  .profile-signature {
    font-size: 17px;
  }
  .tabs {
    gap: 6px;
  }
  .tab {
    padding: 5px 12px;
    font-size: 12px;
  }
  .contact-item {
    padding: 10px 12px;
    gap: 10px;
  }
  .name {
    font-size: 14px;
  }
  .last-msg {
    font-size: 12px;
  }
  .badge-text {
    display: none;
  }
}
</style>
