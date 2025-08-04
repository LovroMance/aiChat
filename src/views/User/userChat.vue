<script setup>
import chatPanel from '@/views/Chat/chatPanel.vue'
import chatInput from '@/views/Chat/chatInput.vue'

import { onMounted, ref } from 'vue'

import { chatPath, createWebSocket } from '@/utils/websocket.js'
import { getUserInfo } from '@/api/user'
import { USER_LOGIN_INFO, USER_INFO_DATA, setStorage, getStorage } from '@/utils/localstorage'

const username = ref('')
const userUid = getStorage(USER_LOGIN_INFO).uid
onMounted(async () => {
  // 1. 发送请求 获取用户基本数据
  const { data } = await getUserInfo(userUid)
  console.log(data)
  // 2. 加载用户数据存储到本地
  setStorage(USER_INFO_DATA, data.data)
  username.value = getStorage(USER_INFO_DATA).username
  // 3. 创建websocket连接
  createWebSocket(chatPath)
})
</script>

<template>
  <el-container style="height: 100vh; min-height: 0; border-left: 1px solid rgba(70, 130, 180, 0.2)">
    <!-- 用户名 -->
    <el-header class="header-container" style="height: 10%">{{ username }}</el-header>
    <!-- 聊天内容 -->
    <el-main style="padding: 0; border-top: 1px solid rgba(70, 130, 180, 0.2)">
      <chatPanel />
    </el-main>
    <!-- 输入框 -->
    <el-footer style="
        background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%);
        height: 20%;
        border-top: 1px solid rgba(70, 130, 180, 0.1);
      ">
      <chatInput />
    </el-footer>
  </el-container>
</template>

<style scoped>
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
