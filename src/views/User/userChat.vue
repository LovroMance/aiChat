<script setup>
import chatPanel from '@/views/Chat/chatPanel.vue'
import chatInput from '@/views/Chat/chatInput.vue'
import chatThread from '../Chat/chatThread.vue'

import { initChatPanel, loadThreadChat } from '@/core/chat'
import { onMounted, ref, nextTick } from 'vue'
import { useUnreadMessagesStore } from '@/stores'

onMounted(async () => {
  await initChatPanel()
  scrollToBottom()
})

const unreadMessagesStore = useUnreadMessagesStore()
const isPopup = ref(false)

// 处理子组件关闭事件
const handleCloseDialog = () => {
  isPopup.value = false
}

// 处理创建群聊事件
const handleCreateGroup = () => {
  isPopup.value = false
}

// 侧边栏相关数据
const activeChat = ref({})

// 选择聊天对象
const selectChat = (chat) => {
  activeChat.value = chat
  loadThreadChat(chat.thread_id)
  // 更新unreadMessageMap 和 indexedDB
}

// 滚动到底部的函数
const scrollToBottom = () => {
  // 使用 nextTick 确保DOM更新后再滚动
  nextTick(() => {
    const chatPanel = document.querySelector('.el-scrollbar__wrap')
    if (chatPanel) {
      chatPanel.scrollTop = chatPanel.scrollHeight
    }
  })
}
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <chatThread v-if="isPopup" @close="handleCloseDialog" @create="handleCreateGroup" />
    <!-- 左侧聊天列表侧边栏 -->
    <el-aside width="320px" class="chat-sidebar">
      <div class="sidebar-header">
        <div class="unread-badge">
          <h3>消息列表</h3>
        </div>
        <el-icon size="20" class="circle-plus" @click="isPopup = !isPopup"><CirclePlus /></el-icon>
      </div>

      <el-scrollbar class="chat-list-container">
        <div class="chat-list">
          <div
            v-for="[key, value] in unreadMessagesStore.unreadMessagesMap"
            :key="key"
            :class="['chat-item', { active: activeChat?.thread_id === key }]"
            @click="selectChat(value)"
          >
            <div class="avatar-container">
              <el-avatar :src="value.thread_avatar" :size="48" />
            </div>

            <div class="chat-info">
              <div class="chat-header">
                <span class="chat-name">{{ value.thread_name }}</span>
                <span class="chat-time">{{ value.lastTime }}</span>
              </div>
              <div class="chat-content">
                <span class="last-message">
                  {{
                    value.type == 'group'
                      ? `${value.senderName}: ${value.content}`
                      : `${value.content}`
                  }}
                </span>
                <el-badge
                  v-if="value.unreadCount > 0"
                  :value="value.unreadCount"
                  :max="99"
                  class="message-badge"
                />
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>

    <!-- 右侧聊天区域 -->
    <el-container
      style="height: 100vh; min-height: 0; border-left: 1px solid rgba(70, 130, 180, 0.2)"
    >
      <!-- 用户名 -->
      <el-header class="header-container" style="height: 10%">
        <span>{{ activeChat.thread_name }}</span>
      </el-header>
      <!-- 聊天内容 -->
      <el-main style="padding: 0; border-top: 1px solid rgba(70, 130, 180, 0.2)">
        <chatPanel />
      </el-main>
      <!-- 输入框 -->
      <el-footer
        style="
          background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%);
          height: 20%;
          border-top: 1px solid rgba(70, 130, 180, 0.1);
        "
      >
        <chatInput @messageSent="scrollToBottom" />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
/* 左侧聊天列表侧边栏样式 */
.chat-sidebar {
  background: linear-gradient(180deg, #f8fbff 0%, #f0f8ff 100%);
  border-right: 1px solid rgba(70, 130, 180, 0.15);
  height: 100vh;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(70, 130, 180, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.unread-badge {
  margin-left: 5px;
  display: flex;
  align-items: center;
  color: #409eff;
}

.circle-plus {
  transition: all 0.3s ease;
  color: #606266;
  cursor: pointer;
}

.circle-plus:hover {
  color: #636465;
  filter: brightness(1.4);
}

.chat-list-container {
  height: calc(100vh - 73px);
}

.chat-list {
  padding: 8px 0;
}

.chat-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(70, 130, 180, 0.05);
}

.chat-item:hover {
  background: rgba(64, 158, 255, 0.08);
}

.chat-item.active {
  background: rgba(64, 158, 255, 0.12);
  border-left: 3px solid #409eff;
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-weight: 500;
  font-size: 14px;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 8px;
}

.chat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px; /* 确保容器高度一致 */
}

.last-message {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  line-height: 1.2;
  margin-right: 8px; /* 为徽章预留空间 */
}

.message-badge {
  flex-shrink: 0;
  width: 26px; /* 固定宽度，确保布局稳定 */
  display: flex;
  justify-content: flex-end;
}

:deep(.el-badge__content) {
  background-color: #f56c6c;
  border: none;
  font-size: 11px;
  height: 18px;
  line-height: 18px;
  min-width: 18px;
  padding: 0 4px;
}

/* 右侧主题头部的字体样式 */
.header-container {
  background: linear-gradient(120deg, #f3fbfe 0%, #eafaf6 100%);
  font-weight: 500;
  font-size: 25px;
  letter-spacing: -1px;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  line-height: 60px;
}
</style>
