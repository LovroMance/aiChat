<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, List, ChatDotRound, User, Setting, Expand, Fold } from '@element-plus/icons-vue'
const isCollapse = ref(true)
const route = useRoute()
const activeMenu = computed(() => route.path)
console.log(activeMenu)

const menuList = [
  { index: '/userHome', icon: Menu, title: '首页' },
  { index: '/FriendGroupList', icon: List, title: '我的列表' },
  { index: '/userChat', icon: ChatDotRound, title: '聊天室' },
  { index: '/userInfo', icon: User, title: '个人资料' },
  { index: '/userSetting', icon: Setting, title: '设置' },
]

</script>

<template>
  <el-container style="height: 100vh; display: flex">
    <el-menu :default-active="activeMenu" :collapse="isCollapse" router>
      <!-- 侧边栏选项 -->
      <el-menu-item v-for="item in menuList" :key="item.index" :index="item.index">
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>

      <div class="el-menu-item" @click="isCollapse = !isCollapse" style="margin-top: auto;">
        <el-icon>
          <component :is="isCollapse ? Expand : Fold" />
        </el-icon>
        <span v-if="!isCollapse" class="toggle-text">{{ isCollapse ? '展开' : '收起' }}</span>
      </div>
    </el-menu>
    <!-- 聊天框 -->
    <router-view style="flex: 1" />
  </el-container>
</template>

<style scoped>
.el-menu {
  background: var(--bg-color-primary);
  display: flex;
  flex-direction: column;
}

/* 控制展开状态的宽度 */
.el-menu:not(.el-menu--collapse) {
  width: 180px;
}

:deep(.el-menu-item) {
  color: var(--font-color-secondary);
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background: var(--bg-color-main);
  color: #ffffff;
}

:deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}
</style>
