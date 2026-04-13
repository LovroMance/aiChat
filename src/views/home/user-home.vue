<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user'
import { USER_LOGIN_INFO, USER_INFO_DATA, setStorage, getStorage } from '@/utils/localstorage'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

onMounted(async () => {
  try {
    const { data } = await getUserInfo({ uid: getStorage(USER_LOGIN_INFO).uid })
    setStorage(USER_INFO_DATA, data.data)
    userStore.setUserInfo(data.data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

const router = useRouter()

// 菜单项配置
const menuItems = ref([
  {
    id: 'contacts',
    title: '通讯录',
    description: '查看好友、群组和联系人',
    icon: 'List',
    route: '/FriendGroupList',
    color: '#409EFF',
  },
  {
    id: 'chatroom',
    title: '聊天室',
    description: '进入聊天室开始对话',
    icon: 'ChatDotRound',
    route: '/userChat',
    color: '#67C23A',
  },
  {
    id: 'notification-center',
    title: '通知中心',
    description: '查看系统通知和消息提醒',
    icon: 'Bell',
    route: '/notificationCenter',
    color: '#F56C6C',
  },
  {
    id: 'ai-chat',
    title: 'AI 助手',
    description: '与 AI 助手进行智能对话',
    icon: 'Cpu',
    route: '/aiChat',
    color: '#8E7EF1',
  },
  {
    id: 'profile',
    title: '个人中心',
    description: '查看和编辑个人信息',
    icon: 'User',
    route: '/userInfo',
    color: '#E6A23C',
  },
  {
    id: 'settings',
    title: '设置',
    description: '应用设置和偏好',
    icon: 'Setting',
    route: '/userSetting',
    color: '#909399',
  },
])

// 导航到指定页面
const navigateTo = (item) => {
  router.push(item.route)
}
</script>

<template>
  <div class="home-container">
    <div class="home-header">
      <h1 class="home-title">欢迎回来</h1>
      <p class="home-subtitle">选择您要进行的操作</p>
    </div>

    <div class="menu-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-card" @click="navigateTo(item)">
        <div class="card-icon" :style="{ backgroundColor: item.color }">
          <el-icon :size="32" color="white">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-description">{{ item.description }}</p>
        </div>
        <div class="card-arrow">
          <el-icon :size="20" color="#909399">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  /* 原深色背景替换为柔和浅色渐变 */
  background: linear-gradient(135deg, #f8fbff 0%, #eef6ff 35%, #eaf9f6 70%, #f2f8ff 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-header {
  text-align: center;
  margin-bottom: 60px;
}

.home-title {
  /* 深色文本提高对比 */
  color: #2c3e50;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.home-subtitle {
  color: #606266;
  font-size: 1.2rem;
  margin: 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 100%;
}

.menu-card {
  /* 改为浅色卡片，提升整体协调 */
  background: linear-gradient(160deg, #ffffff 0%, #f6faff 100%);
  border: 1px solid rgba(70, 130, 180, 0.15);
  box-shadow: 0 6px 18px -6px rgba(64, 158, 255, 0.15);
  border-radius: 20px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;
}

.menu-card:hover {
  border-color: rgba(64, 158, 255, 0.45);
  box-shadow: 0 14px 32px -8px rgba(64, 158, 255, 0.25);
  transform: translateY(-8px);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.menu-card:hover .card-icon {
  transform: scale(1.1);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.card-description {
  color: #606266;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.card-arrow {
  position: absolute;
  top: 20px;
  right: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.menu-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .home-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .home-title {
    font-size: 2rem;
  }

  .home-subtitle {
    font-size: 1rem;
  }

  .menu-card {
    padding: 24px 20px;
    min-height: 160px;
  }

  .card-icon {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 1.3rem;
  }
}
</style>
