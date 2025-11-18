<script setup>
import { ref } from 'vue'
import { Menu, List, ChatDotRound, User, Setting, Expand, Fold } from '@element-plus/icons-vue'
const isCollapse = ref(true)
</script>

<template>
  <el-container style="height: 100vh; display: flex">
    <el-menu default-active="4" :collapse="isCollapse" router>
      <el-menu-item index="1" route="/userHome">
        <el-icon>
          <Menu />
        </el-icon>
        <template #title>首页</template>
      </el-menu-item>

      <el-menu-item index="2" route="/FriendGroupList">
        <el-icon>
          <List />
        </el-icon>
        <template #title>我的列表</template>
      </el-menu-item>

      <el-menu-item index="3" route="/userChat">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <template #title>聊天室</template>
      </el-menu-item>

      <el-menu-item index="4" route="/userInfo">
        <el-icon>
          <User />
        </el-icon>
        <template #title>个人资料</template>
      </el-menu-item>

      <el-menu-item index="5" route="/userSetting">
        <el-icon>
          <Setting />
        </el-icon>
        <template #title>设置</template>
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
