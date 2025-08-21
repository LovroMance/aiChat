<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/utils/websocket.js'

const input = ref('')

const send = async () => {
  if (!input.value.trim()) {
    console.log('消息为空，不发送')
    return
  }
  
  // 构造消息对象
  const messageObj = {
    content: input.value.trim(),
    attachment: null,
    thread_id: 1  // TODO: 替换为实际的房间号
  }
  
  const success = await sendMessage(messageObj)
  if (success) {
    input.value = '' // 清空输入框
    console.log('消息发送成功')
    // 触发滚动到底部事件
    emit('messageSent')
  } else {
    console.error('消息发送失败')
  }
}

// 处理回车键事件
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 阻止默认的换行行为
    send()
  }
}

// 定义emit
const emit = defineEmits(['messageSent'])
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 表情、文件等 -->
      <el-header class="el-header-input">
        <div class="icon-container">
          <el-icon class="header-icon"><Opportunity /></el-icon>
          <el-icon class="header-icon"><Folder /></el-icon>
          <el-icon class="header-icon"><Picture /></el-icon>
          <el-icon class="header-icon"><Location /></el-icon>
        </div>
      </el-header>
      <!-- 文本输入框 -->
      <el-main class="el-main-input">
        <div class="input-container">
          <el-input
            class="el-input-input"
            v-model="input"
            type="textarea"
            :rows="3"
            :autosize="{ minRows: 2, maxRows: 4 }"
            @keydown="handleKeydown"
          />
          <el-button class="send-button" type="primary" @click="send">发送</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  display: flex;
  height: 100%;
  min-height: 0;
  max-height: 100%;
}
.el-header-input {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%);
  padding: 0 16px;
  flex-shrink: 0;
}
.icon-container {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 85%;
}
.header-icon {
  font-size: 32px;
  color: #4682b4;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.header-icon:hover {
  color: #5f9ea0;
  background: rgba(70, 130, 180, 0.1);
  transform: translateY(-1px);
}
.el-main-input {
  padding: 8px 20px;
  border-top: 1px solid rgba(70, 130, 180, 0.15);
  background: linear-gradient(120deg, #e8f4fd 0%, #f0f8ff 100%);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 100%;
  min-height: 0;
  flex: 1;
}
.el-input-input {
  flex: 1;
  width: 100%;
  min-height: 0;
  max-height: 100%;
  height: 100%;
  display: flex;
}
.el-input-input :deep(.el-textarea__inner) {
  min-height: 100%;
  max-height: 100%;
  height: 100% !important;
  box-sizing: border-box;
  color: #4682b4;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  padding: 16px 10px;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(70,130,180,0.2);
  resize: none;
  text-align: left;
  vertical-align: top;
  overflow-y: auto;
}

/* 兼容 Firefox，彻底隐藏按钮 */
.el-input-input :deep(.el-textarea__inner) {
  scrollbar-width: thin;
  scrollbar-color: #c2e0f7 transparent;
  scrollbar-gutter: stable both-edges;
}
.el-input-input :deep(.el-textarea__inner::placeholder) {
  color: rgba(70, 130, 180, 0.6);
  font-style: italic;
}
.send-button {
  background: linear-gradient(135deg, #4682b4 0%, #5f9ea0 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex-shrink: 0;
  height: fit-content;
}
.send-button:hover {
  background: linear-gradient(135deg, #5f9ea0 0%, #4682b4 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.3);
}
</style>
