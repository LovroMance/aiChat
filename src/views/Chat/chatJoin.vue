<script setup>
import { ref } from 'vue'
import { ElInput, ElButton, ElMessage } from 'element-plus'

import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
const uid = getStorage(USER_LOGIN_INFO).uid // 获取用户id
import { threadJoin } from '@/api/chat'

const roomId = ref('') // thread_id 房间号
const loading = ref(false)

const joinRoom = async () => {
  if (!roomId.value.trim()) {
    ElMessage.warning('请输入房间号')
    return
  }
  loading.value = true

  const apiData = { thread_id: roomId.value, uid: uid }
  const data = await threadJoin(apiData)
  console.log(data)
}
</script>

<template>
  <div class="join-bg">
    <div class="glass-layer"></div>
    <div class="join-content">
      <div class="join-card">
        <h2>
          <span class="icon">💬</span>
          加入聊天房间
        </h2>
        <p class="subtitle">请输入房间号，和朋友一起畅聊吧！</p>
        <el-input
          v-model="roomId"
          placeholder="输入房间号"
          size="large"
          clearable
          class="room-input"
          @keyup.enter="joinRoom"
        />
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="join-btn"
          @click="joinRoom"
        >
          加入房间
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.join-bg {
  width: 100%;
  height: 100%;
  min-height: 400px;
  min-width: 320px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: linear-gradient(135deg, #23272e 0%, #3a4047 60%, #6b7b8a 100%);
}
.glass-layer {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  z-index: 1;
}
.join-content {
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 400px;
  min-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.join-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.18);
  padding: 56px 44px 44px 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 360px;
  max-width: 95vw;
  animation: floatIn 1.2s cubic-bezier(0.23, 1.02, 0.32, 1) 0s 1;
  border-image: linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%) 1;
}
@keyframes floatIn {
  0% {
    transform: translateY(60px) scale(0.95);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.join-card h2 {
  font-size: 2.4rem;
  font-weight: bold;
  color: #5f2eea;
  margin-bottom: 12px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 2px 12px #e0c3fc40;
}
.icon {
  font-size: 2.1rem;
  filter: drop-shadow(0 2px 8px #e0c3fc80);
}
.subtitle {
  color: #888;
  margin-bottom: 32px;
  font-size: 1.15rem;
  letter-spacing: 1px;
}
.room-input {
  width: 260px;
  margin-bottom: 26px;
  font-size: 1.15rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px #e0c3fc40;
  background: rgba(255, 255, 255, 0.7);
}
.join-btn {
  width: 260px;
  font-size: 1.15rem;
  letter-spacing: 1px;
  border-radius: 10px;
  box-shadow: 0 2px 12px #e0c3fc80;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  font-weight: bold;
  background: linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%);
  color: #fff;
  border: none;
}
.join-btn:hover {
  background: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
  color: #5f2eea;
  box-shadow: 0 4px 24px #e0c3fc80;
}
.art-bg {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: url('https://cdn.pixabay.com/photo/2017/08/30/07/52/pattern-2695561_1280.png') repeat;
  opacity: 0.07;
  filter: blur(2px);
}

@media (max-width: 600px) {
  .join-card {
    min-width: 90vw;
    padding: 32px 8vw 28px 8vw;
  }
  .room-input,
  .join-btn {
    width: 100%;
    min-width: 0;
  }
}
</style>