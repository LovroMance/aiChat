<script setup>
import chatPanel from '@/views/Chat/chatPanel.vue'
import chatInput from '@/views/Chat/chatInput.vue'
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>好友</span>
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
            <ChatDotRound />
          </el-icon>
          <template #title>聊天室</template>
        </el-menu-item>

        <el-menu-item index="3">
          <el-icon>
            <Search />
          </el-icon>
          <template #title>搜索</template>
        </el-menu-item>


      </el-menu>
    </el-aside>

    <!-- 聊天框 -->
    <el-container style="height: 100vh; min-height: 0; border-left: 1px solid rgba(70, 130, 180, 0.2);">
      <!-- 用户名 -->
      <el-header class="header-container" style="height: 10%;">用户名</el-header>
      <!-- 聊天内容 -->
      <el-main style="padding: 0; border-top: 1px solid rgba(70, 130, 180, 0.2);">
        <chatPanel />
      </el-main>
      <!-- 输入框 -->
      <el-footer style="background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%); height: 20%; border-top: 1px solid rgba(70, 130, 180, 0.1);">
        <chatInput />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  border: 0;
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
