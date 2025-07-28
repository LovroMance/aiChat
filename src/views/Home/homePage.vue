<script setup>
import { ref } from 'vue'
import chatPanel from '@/views/Chat/chatPanel.vue'
import chatInput from '@/views/Chat/chatInput.vue'
const isCollapse = ref(false)
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px; margin-left: 10px">
        <el-radio-button :value="false">expand</el-radio-button>
        <el-radio-button :value="true">collapse</el-radio-button>
      </el-radio-group>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>好友列表</span>
          </template>
          <el-sub-menu index="1-1">
            <template #title>
              <span>分类1</span>
            </template>
            <el-menu-item index="1-1-1">好友1</el-menu-item>
            <el-menu-item index="1-1-1">好友2</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="1-2">
            <template #title>
              <span>分类2</span>
            </template>
            <el-menu-item index="1-2-1">好友1</el-menu-item>
            <el-menu-item index="1-2-1">好友2</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <el-menu-item index="2">
          <el-icon>
            <Search />
          </el-icon>
          <template #title>搜索</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 聊天框 -->
    <el-container style="height: 100vh; min-height: 0">
      <el-header class="header-container" style="height: 10%">用户名</el-header>
      <el-main style="padding: 0">
        <chatPanel />
      </el-main>
      <el-footer style="background-color: green; height: 10%">
        <chatInput />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

/* 右侧主题头部的字体样式 */
.header-container {
  background-color: rgba(169, 169, 169, 0.5);
  font-weight: 500;
  font-size: 25px;
  letter-spacing: -1px;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  line-height: 60px;
}
</style>
