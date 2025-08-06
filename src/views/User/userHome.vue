<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user'
import { USER_LOGIN_INFO, USER_INFO_DATA, getStorage, setStorage } from '@/utils/localstorage'
import { useUserStore } from '@/stores/User'

const userStore = useUserStore()
const userInfo = getStorage(USER_LOGIN_INFO)

onMounted(async () => {
  const { data } = await getUserInfo(userInfo.uid)
  console.log(data)
  setStorage(USER_INFO_DATA, data.data)
  userStore.setUserInfo(data.data)
})

const router = useRouter()

// 菜单项配置
const menuItems = ref([
  {
    id: 'friends',
    title: '好友',
    description: '管理您的好友列表',
    icon: 'User',
    route: '/userFriends',
    color: '#409EFF'
  },
  {
    id: 'chatroom',
    title: '聊天室',
    description: '进入聊天室开始对话',
    icon: 'ChatDotRound',
    route: '/userChat',
    color: '#67C23A'
  },
  {
    id: 'profile',
    title: '个人资料',
    description: '查看和编辑个人信息',
    icon: 'UserFilled',
    route: '/userInfo',
    color: '#E6A23C'
  },
  {
    id: 'settings',
    title: '设置',
    description: '应用设置和偏好',
    icon: 'Setting',
    route: '/userSetting',
    color: '#F56C6C'
  }
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
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        class="menu-card"
        @click="navigateTo(item)"
      >
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
  background: linear-gradient(135deg, #23272e 0%, #3a4047 70%, #6b7b8a 100%);
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
  color: #ececec;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.home-subtitle {
  color: #b0b0b0;
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
  background: #23272e;
  border-radius: 20px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;
}

.menu-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-8px);
  border-color: #6b7b8a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.menu-card:hover::before {
  opacity: 1;
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
  color: #ececec;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.card-description {
  color: #b0b0b0;
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
