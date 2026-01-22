<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, List, ChatDotRound, User, Setting, Expand, Fold, Cpu } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const route = useRoute()
const activeMenu = computed(() => route.path)

const menuList = [
  { index: '/userHome', icon: Menu, title: '首页' },
  { index: '/FriendGroupList', icon: List, title: '通讯录' },
  { index: '/userChat', icon: ChatDotRound, title: '聊天室' },
  { index: '/aiChat', icon: Cpu, title: 'AI 助手' },
  { index: '/userInfo', icon: User, title: '个人中心' },
  { index: '/userSetting', icon: Setting, title: '设置' },
]
</script>

<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <aside :class="['sidebar', { collapsed: isCollapse }]">
      <!-- Logo区域 -->
      <div class="logo-container">
        <div class="logo-box">
          <el-icon :size="24" color="#fff"><ChatDotRound /></el-icon>
        </div>
        <span class="app-title" v-show="!isCollapse">AI Chat</span>
      </div>

      <!-- 菜单区域 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
        class="custom-menu"
        :collapse-transition="false"
      >
        <el-menu-item v-for="item in menuList" :key="item.index" :index="item.index">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>
            <span class="menu-title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>

      <!-- 底部折叠按钮 -->
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon :size="20">
          <component :is="isCollapse ? Expand : Fold" />
        </el-icon>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
/* 布局容器 */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
  width: 240px;
  z-index: 10;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.02);
}

.sidebar.collapsed {
  width: 64px;
}

/* Logo */
.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.logo-box {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s;
}

.collapsed .app-title {
  opacity: 0;
  display: none;
}

/* 菜单 */
.custom-menu {
  border-right: none;
  flex: 1;
  padding: 16px 8px;
  background: transparent;
}

:deep(.el-menu-item) {
  border-radius: 8px;
  margin-bottom: 4px;
  height: 50px;
  line-height: 50px;
  color: #606266;
  border: none;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
  color: #409eff;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #ecf5ff 0%, #f0f9eb 100%);
  color: #409eff;
  font-weight: 600;
}

:deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 12px;
  transition: all 0.3s;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #409eff;
}

.menu-title {
  font-size: 14px;
}

/* 折叠按钮 */
.collapse-btn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: #f9fafc;
  color: #409eff;
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #f8fbff;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
