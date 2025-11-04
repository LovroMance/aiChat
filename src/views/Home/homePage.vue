<script setup>
import { ref } from 'vue'
import { Menu, List, Connection, ChatDotRound, User, Setting } from '@element-plus/icons-vue'
const isCollapse = ref(true)
</script>

<template>
  <el-container style="height: 100vh; min-height: 0; display: flex">
    <el-menu default-active="4" class="el-menu-vertical-demo" :collapse="isCollapse" router>
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

      <el-menu-item index="3" route="/chatJoin">
        <el-icon>
          <Connection />
        </el-icon>
        <template #title>频道</template>
      </el-menu-item>

      <el-menu-item index="4" route="/userChat">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <template #title>聊天室</template>
      </el-menu-item>

      <el-menu-item index="5" route="/userInfo">
        <el-icon>
          <User />
        </el-icon>
        <template #title>个人资料</template>
      </el-menu-item>

      <el-menu-item index="6" route="/userSetting">
        <el-icon>
          <Setting />
        </el-icon>
        <template #title>设置</template>
      </el-menu-item>

      <button @click="isCollapse = !isCollapse">button</button>
    </el-menu>
    <!-- 聊天框 -->
    <router-view style="flex: 1" />
  </el-container>
</template>

<style scoped>
.el-menu {
  background: var(--primary-bgc);
}

/* 控制展开状态的宽度 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

:deep(.el-menu-item) {
  color: #ececec !important;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  border-right: 3px solid #6b7b8a;
}
</style>
