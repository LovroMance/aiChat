<script setup>
import { ref } from 'vue'

// 演示数据，包含自己和对方的消息
const messages = ref([
  {
    id: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '林左臣',
    content: '你好，请问你在吗？',
    time: '2025-07-28 14:21',
    self: false
  },
  {
    id: 2,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '我',
    content: '在的，有什么可以帮你？',
    time: '2025-07-28 14:22',
    self: true
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '小明',
    content: '能帮我看看这个 Vue 代码吗？',
    time: '2025-07-28 14:23',
    self: false
  }
])
</script>

<template>
  <el-scrollbar class="chat-panel" style="height: 100%;">
    <div>
      <div v-for="msg in messages" :key="msg.id" :class="['chat-message', msg.self ? 'self' : 'other']">
        <img class="avatar" :src="msg.avatar" :alt="msg.username" />
        <div class="message-content">
          <div class="username-time" :class="msg.self ? 'self' : ''">
            <span class="username">{{ msg.username }}</span>
            <span class="time">{{ msg.time }}</span>
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.chat-panel {
  width: 100%;
  height: 100%;
  /* 只保留左右内边距，去掉上下 */
  padding: 16px 24px 0px;
  background: linear-gradient(120deg, #f3fbfe 0%, #eafaf6 100%);
  box-sizing: border-box;
}
.chat-message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 22px;
  padding: 0 24px;
}
.chat-message.other {
  flex-direction: row;
}
.chat-message.self {
  flex-direction: row-reverse;
}
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin: 0 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1.5px solid #b2dfdb;
  background: #fff;
}
.message-content {
  max-width: 340px;
  background: #fff;
  border-radius: 22px 22px 22px 6px;
  padding: 14px 20px 10px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  position: relative;
  transition: background 0.3s;
  min-width: 80px;
}
.chat-message.self .message-content {
  background: linear-gradient(135deg, #c6f7e2 0%, #b3e5fc 100%);
  border-radius: 22px 22px 6px 22px;
  box-shadow: 0 2px 12px rgba(44, 185, 176, 0.08);
}
.username-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.username-time.self {
  flex-direction: row-reverse;
}
.username {
  font-weight: 500;
  color: #4a6fa5;
  font-size: 14px;
  opacity: 0.85;
}
.chat-message.self .username {
  color: #2e7d6b;
  opacity: 0.85;
}
.time {
  font-size: 12px;
  color: #b0b8c9;
  margin-left: 8px;
  opacity: 0.7;
}
.content {
  font-size: 16px;
  color: #35505a;
  word-break: break-all;
  line-height: 1.8;
  letter-spacing: 0.01em;
  margin-top: 2px;
}
.chat-message.self .content {
  color: #236d5e;
}
</style>
