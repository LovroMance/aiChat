<script setup>
import chatPanel from '@/views/Chat/chatPanel.vue'
import chatInput from '@/views/Chat/chatInput.vue'
import chatThread from '../Chat/chatThread.vue'

import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue'

import { closeWebSocket } from '@/utils/websocket.js'
import { getUserInfo } from '@/api/user'
import { getPartMessages } from '@/api/chat'
import { USER_LOGIN_INFO, USER_INFO_DATA, setStorage, getStorage } from '@/utils/localstorage'
import { MESSAGES_STORE, initDB, getAllData, closeDB, addBatchData, getLastData, } from '@/utils/indexedDB'

import { useMessageStore, useUnreadMessagesStore} from '@/stores'
const messageStore = useMessageStore()
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

const username = ref('')
const userUid = getStorage(USER_LOGIN_INFO).uid
const beforeMessages = ref([])
const offlineMessages = ref([])

// 侧边栏相关数据
const activeChat = ref(null)
const chatList = ref([])

// 选择聊天对象
const selectChat = (chat) => {
  activeChat.value = chat
  // 清除未读消息数
  chat.unreadCount = 0
}

// 计算总未读消息数
const totalUnreadCount = computed(() => {
  return chatList.value.reduce((total, chat) => total + chat.unreadCount, 0)
})

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


onMounted(async () => {
  // 1. 发送请求 获取用户基本数据
  const { data } = await getUserInfo(userUid)
  console.log('getUserInfo/api', data)
  // 2. 加载用户数据存储到本地
  setStorage(USER_INFO_DATA, data.data)
  username.value = getStorage(USER_INFO_DATA).username

  // 3. 创建websocket连接 移动到home页面

  // 4. 初始化（打开）本地数据库
  await initDB()
  // 5. 获取本地数据库聊天历史
  const messages = await getAllData(MESSAGES_STORE)
  beforeMessages.value = messages

  // 6. 获取离线聊天历史
  // 6.1 获取最后一条本地聊天记录id

  const getLastMessageId = await getLastData(MESSAGES_STORE)
  if (getLastMessageId) {
    const { message_id } = getLastMessageId
    console.log('getLastData/indexedDB --> message_id', message_id)

    // 6.2 获取离线聊天记录 （根据message_id获取聊天历史）
    const res = await getPartMessages({
      thread_id: 1,
      existing_id: message_id,
    })
    console.log('getPartMessages/api --> 离线消息', res.data.data)
    // 7. 将离线消息添加到本地数据库
    await addBatchData(MESSAGES_STORE, res.data.data)
    offlineMessages.value = res.data.data
  }

  // 默认选择第一个聊天
  if (chatList.value.length > 0) {
    activeChat.value = chatList.value[0]
  }

  scrollToBottom()
})

onUnmounted(async () => {
  // 组件卸载时关闭WebSocket连接 (内有关闭数据库)
  closeWebSocket()
  // 清空store中的消息
  messageStore.clearMessage()
  // 关闭数据库
  await closeDB()
})
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <chatThread 
      v-if="isPopup" 
      @close="handleCloseDialog"
      @create="handleCreateGroup"
    />
    <!-- 左侧聊天列表侧边栏 -->
    <el-aside width="320px" class="chat-sidebar">
      <div class="sidebar-header">
        <div class="unread-badge">
          <h3>消息列表</h3>
          <el-badge :value="totalUnreadCount" :hidden="totalUnreadCount === 0" style="display: flex; margin-left: 5px;">
            <el-icon size="20"><ChatLineRound /></el-icon>
          </el-badge>
        </div>
        <el-icon size="20" class="circle-plus" @click="isPopup = !isPopup"><CirclePlus /></el-icon>
      </div>

      <el-scrollbar class="chat-list-container">
        <div class="chat-list">
          <div
            v-for="[key, value] in unreadMessagesStore.unreadMessagesMap"
            :key="key"
            :class="['chat-item', { active: activeChat?.id === key }]"
            @click="selectChat(chat)"
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
                  {{ value.type === 'group' ? `${value.senderName}: ${value.content}` : value.content }}
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
        <span v-if="activeChat">{{ activeChat.name }}</span>
        <span v-else>{{ username }}</span>
      </el-header>
      <!-- 聊天内容 -->
      <el-main style="padding: 0; border-top: 1px solid rgba(70, 130, 180, 0.2)">
        <chatPanel :beforeMessages="beforeMessages" :offlineMessages="offlineMessages" />
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
}

.last-message {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  line-height: 1.2;
}

.message-badge {
  flex-shrink: 0;
  margin-left: 8px;
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
