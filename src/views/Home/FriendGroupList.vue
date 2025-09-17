<!-- 好友群聊列表页面 -->
<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, UserFilled, ChatDotRound } from '@element-plus/icons-vue'

// 模拟数据 - 实际开发中应该从 API 获取
const friends = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    lastMessage: '你好，今天天气不错',
    lastTime: '10:30',
    unreadCount: 2,
    type: 'friend'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    lastMessage: '明天的会议准备好了吗？',
    lastTime: '09:15',
    unreadCount: 0,
    type: 'friend'
  },
  {
    id: 3,
    name: '前端开发群',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c84e5304d920c15e41b60dpng.png',
    lastMessage: '王五: 这个新的 Vue 3 特性很有用',
    lastTime: '昨天',
    unreadCount: 5,
    type: 'group'
  },
  {
    id: 4,
    name: 'AI 助手',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    lastMessage: '我可以帮助您解决任何问题',
    lastTime: '2天前',
    unreadCount: 0,
    type: 'ai'
  }
])

const searchQuery = ref('')
const activeTab = ref('all') // all, friends, groups, ai

// 搜索过滤
const filteredContacts = computed(() => {
  let result = friends.value
  
  // 按类型过滤
  if (activeTab.value !== 'all') {
    const typeMap = {
      'friends': 'friend',
      'groups': 'group', 
      'ai': 'ai'
    }
    result = result.filter(contact => contact.type === typeMap[activeTab.value])
  }
  
  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    result = result.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return result
})

// 计算未读消息总数
const totalUnreadCount = computed(() => {
  return friends.value.reduce((total, contact) => total + contact.unreadCount, 0)
})
console.log(totalUnreadCount)

// 添加好友/群聊
const handleAddContact = () => {
  if (!searchQuery.value.trim()) {
    ElMessage({
      message: '请输入要搜索的用户名或群聊名',
      type: 'warning'
    })
    return
  }
  
  ElMessage({
    message: `正在搜索「${searchQuery.value}」...`,
    type: 'info'
  })
  
  // 这里应该调用 API 搜索用户或群聊
  // TODO: 实现实际的搜索功能
}

// 点击联系人
const handleContactClick = (contact) => {
  console.log('点击联系人:', contact)
  // 这里应该跳转到聊天页面或执行其他操作
  ElMessage({
    message: `打开与 ${contact.name} 的聊天`,
    type: 'success'
  })
}

// 获取联系人类型图标
const getContactIcon = (type) => {
  switch (type) {
    case 'friend': return UserFilled
    case 'group': return ChatDotRound
    case 'ai': return ChatDotRound
    default: return UserFilled
  }
}

// 获取联系人类型颜色
const getContactTypeColor = (type) => {
  switch (type) {
    case 'friend': return '#67C23A'
    case 'group': return '#409EFF'
    case 'ai': return '#E6A23C'
    default: return '#909399'
  }
}
</script>

<template>
  <div class="friend-list-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Search /></el-icon>
          添加联系人
        </h2>
      </div>
      
      <div class="search-input-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、群聊名或邮箱"
          class="search-input"
          clearable
          @keyup.enter="handleAddContact"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
          
        </el-input>
        <el-button 
          type="primary" 
          class="add-btn"
          @click="handleAddContact"
          :disabled="!searchQuery.trim()"
        >
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <div 
        class="tab-item"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部 ({{ friends.length }})
      </div>
      <div 
        class="tab-item"
        :class="{ active: activeTab === 'friends' }"
        @click="activeTab = 'friends'"
      >
        好友 ({{ friends.filter(f => f.type === 'friend').length }})
      </div>
      <div 
        class="tab-item"
        :class="{ active: activeTab === 'groups' }"
        @click="activeTab = 'groups'"
      >
        群聊 ({{ friends.filter(f => f.type === 'group').length }})
      </div>
      <div 
        class="tab-item"
        :class="{ active: activeTab === 'ai' }"
        @click="activeTab = 'ai'"
      >
        AI ({{ friends.filter(f => f.type === 'ai').length }})
      </div>
    </div>

    <!-- 联系人列表 -->
    <div class="contacts-section">
      <h3 class="section-subtitle">
        <el-icon class="subtitle-icon"><ChatDotRound /></el-icon>
        {{ activeTab === 'all' ? '全部联系人' : 
           activeTab === 'friends' ? '我的好友' :
           activeTab === 'groups' ? '群聊列表' : 'AI 助手' }}
      </h3>
      
      <div class="contacts-list">
        <div 
          v-for="contact in filteredContacts" 
          :key="contact.id"
          class="contact-item"
          @click="handleContactClick(contact)"
        >
          <div class="contact-avatar-container">
            <el-avatar 
              :src="contact.avatar" 
              :size="50"
              class="contact-avatar"
            >
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <!-- 未读消息提示 -->
            <div 
              v-if="contact.unreadCount > 0" 
              class="unread-count"
            >
              {{ contact.unreadCount > 99 ? '99+' : contact.unreadCount }}
            </div>
            <!-- 联系人类型标识 -->
            <div 
              class="contact-type-badge"
              :style="{ backgroundColor: getContactTypeColor(contact.type) }"
            >
              <el-icon :size="10"><component :is="getContactIcon(contact.type)" /></el-icon>
            </div>
          </div>
          
          <div class="contact-info">
            <div class="contact-header">
              <h4 class="contact-name">{{ contact.name }}</h4>
              <span class="last-time">{{ contact.lastTime }}</span>
            </div>
            <p class="last-message">{{ contact.lastMessage }}</p>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="filteredContacts.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon :size="48"><Search /></el-icon>
          </div>
          <p class="empty-text">
            {{ searchQuery ? '未找到相关联系人' : '暂无联系人' }}
          </p>
          <p class="empty-hint">
            {{ searchQuery ? '尝试使用其他关键词搜索' : '通过上方搜索框添加好友或群聊' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 搜索区域样式 */
.search-section {
  width: 100%;
  background: linear-gradient(135deg, #23272e 0%, #3a4047 70%, #6b7b8a 100%);
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  color: #ececec;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.title-icon {
  color: #6b7b8a;
}

.unread-badge {
  background: linear-gradient(45deg, #ff4757, #ff3742);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.search-input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
}

:deep(.search-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

:deep(.search-input .el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

:deep(.search-input .el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.2);
  border-color: #6b7b8a;
  box-shadow: 0 0 0 2px rgba(107, 123, 138, 0.2);
}

:deep(.search-input .el-input__inner) {
  color: #ececec;
  font-size: 14px;
}

:deep(.search-input .el-input__inner::placeholder) {
  color: rgba(236, 236, 236, 0.6);
}

.search-icon {
  color: rgba(236, 236, 236, 0.7);
}

.add-btn {
  background: linear-gradient(90deg, #6b7b8a 60%, #545c64 100%);
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: linear-gradient(90deg, #545c64 60%, #6b7b8a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 123, 138, 0.3);
}

.add-btn:disabled {
  background: rgba(107, 123, 138, 0.5);
  transform: none;
  box-shadow: none;
}

/* 筛选标签样式 */
.filter-tabs {
  width: 100%;
  display: flex;
  background: white;
  padding: 16px 24px;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  background: #f5f7fa;
  border: 1px solid transparent;
}

.tab-item:hover {
  background: #e8f4fd;
  color: #409EFF;
  border-color: rgba(64, 158, 255, 0.2);
}

.tab-item.active {
  background: linear-gradient(135deg, #409EFF, #1890ff);
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 联系人区域样式 */
.contacts-section {
  width: 100%;
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.section-subtitle {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtitle-icon {
  color: #6b7b8a;
}

.contacts-list {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(107, 123, 138, 0.2);
}

.contact-avatar-container {
  position: relative;
  margin-right: 16px;
}

.contact-avatar {
  border: 2px solid rgba(107, 123, 138, 0.1);
  transition: all 0.3s ease;
}

.contact-item:hover .contact-avatar {
  border-color: rgba(107, 123, 138, 0.3);
}

.unread-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(45deg, #ff4757, #ff3742);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
  animation: pulse 2s infinite;
}

.contact-type-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.contact-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 8px;
}

.last-message {
  font-size: 14px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  margin: 0;
  color: #999;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .friend-list-container {
    width: 100%;
    height: 100vh;
  }
  
  .search-section {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .search-input-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .filter-tabs {
    width: 100%;
    padding: 12px 16px;
    overflow-x: auto;
    gap: 6px;
    box-sizing: border-box;
  }
  
  .tab-item {
    white-space: nowrap;
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .contacts-section {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  
  .contact-item {
    padding: 12px;
  }
  
  .contact-name {
    font-size: 15px;
  }
  
  .last-message {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .contact-avatar-container {
    margin-right: 12px;
  }
  
  :deep(.contact-avatar) {
    width: 40px !important;
    height: 40px !important;
  }
  
  .unread-count {
    font-size: 9px;
    padding: 1px 4px;
  }
  
  .contact-type-badge {
    width: 14px;
    height: 14px;
  }
}
</style>