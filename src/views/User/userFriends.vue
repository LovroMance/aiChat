<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟好友数据
const friends = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://via.placeholder.com/50',
    status: 'online',
    lastMessage: '你好！'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://via.placeholder.com/50',
    status: 'offline',
    lastMessage: '在吗？'
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://via.placeholder.com/50',
    status: 'online',
    lastMessage: '明天见！'
  }
])

const goBack = () => {
  router.push('/userHome')
}
</script>

<template>
  <div class="friends-container">
    <div class="friends-header">
      <el-button @click="goBack" type="text" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="friends-title">好友列表</h1>
    </div>
    
    <div class="friends-list">
      <div 
        v-for="friend in friends" 
        :key="friend.id"
        class="friend-item"
      >
        <div class="friend-avatar">
          <img :src="friend.avatar" :alt="friend.name" />
          <div 
            class="status-indicator"
            :class="friend.status"
          ></div>
        </div>
        <div class="friend-info">
          <h3 class="friend-name">{{ friend.name }}</h3>
          <p class="friend-message">{{ friend.lastMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friends-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #23272e 0%, #3a4047 70%, #6b7b8a 100%);
  padding: 20px;
}

.friends-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.back-btn {
  color: #ececec;
  font-size: 1rem;
  margin-right: 20px;
}

.back-btn:hover {
  color: #6b7b8a;
}

.friends-title {
  color: #ececec;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.friends-list {
  max-width: 600px;
  margin: 0 auto;
}

.friend-item {
  background: #23272e;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.friend-item:hover {
  border-color: #6b7b8a;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.friend-avatar {
  position: relative;
  margin-right: 16px;
}

.friend-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #23272e;
}

.status-indicator.online {
  background-color: #67C23A;
}

.status-indicator.offline {
  background-color: #909399;
}

.friend-info {
  flex: 1;
}

.friend-name {
  color: #ececec;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.friend-message {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin: 0;
}
</style> 