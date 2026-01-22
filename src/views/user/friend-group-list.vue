<script setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { useContactList } from '@/composables/user/useContactList'

const {
  contacts,
  query,
  activeTab,
  tabs,
  filteredContacts,
  activeLabel,
  handleSearch,
  openChat,
  typeBadgeText,
  typeIcon,
} = useContactList()
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
            @keyup.enter="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="!query.trim()"
            @click="handleSearch"
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

    <!-- 联系人列表 -->
    <section class="list-section">
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
}

@media (max-width: 560px) {
  .contact-page {
    padding: 12px 14px;
  }
  .add-inner {
    padding: 22px 20px 16px;
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
