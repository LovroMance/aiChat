<script setup>
import { onMounted, ref } from 'vue'
import { CirclePlus, MoreFilled } from '@element-plus/icons-vue'
import { useChat } from '@/composables/chat/useChat'
import { formatTimeHour } from '@/utils/format'
import chatPanel from '@/components/chat/chat-panel.vue'
import chatInput from '@/components/chat/chat-input.vue'
import createGroup from '@/components/chat/group-create.vue'
// ✅ 使用 Composables 替代之前的复杂逻辑
const {
  activeThread,
  unreadMessages,
  initChat,
  selectThread,
  createGroup: handleCreateGroup,
  scrollToBottom,
  setChatPanelRef,
} = useChat()

// 只保留 UI 相关的状态
const isPopup = ref(false)
const chatPanelRef = ref(null)

// ✅ 应用启动时初始化
onMounted(async () => {
  await initChat()
  setChatPanelRef(chatPanelRef.value)
  scrollToBottom()
})

// ✅ 处理弹窗关闭
const handleCloseDialog = () => {
  isPopup.value = false
}

// ✅ 处理群聊创建
const handleGroupCreated = async (groupForm) => {
  const success = await handleCreateGroup(groupForm)
  if (success) {
    isPopup.value = false
  }
}

// ✅ 处理线程选择
const handleSelectChat = async (chat) => {
  await selectThread(chat)
  scrollToBottom()
}
</script>

<template>
  <el-container class="chat-layout">
    <createGroup v-if="isPopup" @close="handleCloseDialog" @submit="handleGroupCreated" />

    <!-- 左侧聊天列表侧边栏 -->
    <el-aside width="280px" class="chat-sidebar">
      <div class="sidebar-header">
        <h3 class="title">消息</h3>
        <el-button circle text @click="isPopup = !isPopup">
          <el-icon :size="20"><CirclePlus /></el-icon>
        </el-button>
      </div>

      <el-scrollbar class="chat-list-scroll">
        <div class="chat-list">
          <div
            v-for="chat in unreadMessages"
            :key="chat.thread_id"
            :class="['chat-item', { active: activeThread?.thread_id === chat.thread_id }]"
            @click="handleSelectChat(chat)"
          >
            <div class="avatar-wrapper">
              <el-avatar :src="chat.thread_avatar" :size="44" shape="square" class="chat-avatar" />
              <div v-if="chat.unreadCount > 0" class="unread-dot">
                {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
              </div>
            </div>

            <div class="chat-info">
              <div class="chat-header-row">
                <span class="chat-name">{{ chat.thread_name }}</span>
                <span class="chat-time">{{ formatTimeHour(chat.lastTime) }}</span>
              </div>
              <div class="chat-content-row">
                <span class="last-message">
                  {{
                    chat.type == 'group' ? `${chat.senderName}: ${chat.content}` : `${chat.content}`
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>

    <!-- 右侧聊天区域 -->
    <el-container class="chat-main-area">
      <!-- 顶部导航 -->
      <el-header class="chat-header-bar">
        <div class="header-content">
          <span class="current-chat-name">{{ activeThread?.thread_name }}</span>
          <el-button link>
            <el-icon :size="20"><MoreFilled /></el-icon>
          </el-button>
        </div>
      </el-header>

      <!-- 聊天内容 -->
      <el-main class="chat-content-area">
        <chatPanel ref="chatPanelRef" />
      </el-main>

      <!-- 输入框 -->
      <el-footer class="chat-input-area">
        <chatInput @messageSent="scrollToBottom" />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.chat-layout {
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
}

/* 侧边栏 */
.chat-sidebar {
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.chat-list-scroll {
  flex: 1;
}

.chat-list {
  padding: 0;
}

.chat-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.chat-item:hover {
  background-color: #f1f5f9;
}

.chat-item.active {
  background-color: #e0f2fe;
  border-left: 3px solid #3b82f6;
}

.avatar-wrapper {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.chat-avatar {
  background: #cbd5e1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.unread-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  min-width: 16px;
  text-align: center;
  border: 2px solid #f8fafc;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.chat-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.chat-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
  margin-left: 8px;
}

.chat-content-row {
  display: flex;
  align-items: center;
}

.last-message {
  font-size: 13px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

/* 右侧主区域 */
.chat-main-area {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.chat-header-bar {
  height: 60px;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-chat-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.chat-content-area {
  flex: 1;
  padding: 0;
  background-color: #f8fafc;
  overflow: hidden;
}

.chat-input-area {
  height: auto !important;
  min-height: 140px;
  padding: 0;
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
}
</style>
