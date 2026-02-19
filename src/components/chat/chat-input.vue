<script setup>
import { Paperclip, Picture, MapLocation, Star, Promotion } from '@element-plus/icons-vue'
import { useMessageInput } from '@/composables/chat/useMessageInput'

const emit = defineEmits(['messageSent'])
const { input, send, handleKeydown } = useMessageInput(emit)
</script>

<template>
  <div class="input-wrapper">
    <!-- 输入区域 -->
    <div class="input-container">
      <el-input
        v-model="input"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        resize="none"
        class="custom-textarea"
        @keydown="handleKeydown"
      />

      <!-- 底部工具栏 -->
      <div class="footer-toolbar">
        <div class="tools-left">
          <el-tooltip content="表情" placement="top" :show-after="500">
            <div class="icon-btn">
              <el-icon><Star /></el-icon>
            </div>
          </el-tooltip>
          <el-tooltip content="附件" placement="top" :show-after="500">
            <div class="icon-btn">
              <el-icon><Paperclip /></el-icon>
            </div>
          </el-tooltip>
          <el-tooltip content="图片" placement="top" :show-after="500">
            <div class="icon-btn">
              <el-icon><Picture /></el-icon>
            </div>
          </el-tooltip>
          <el-tooltip content="位置" placement="top" :show-after="500">
            <div class="icon-btn">
              <el-icon><MapLocation /></el-icon>
            </div>
          </el-tooltip>
        </div>

        <div class="actions-right">
          <span class="tip">Enter 发送</span>
          <el-button type="primary" class="send-btn" @click="send" :disabled="!input.trim()" circle>
            <el-icon><Promotion /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-container {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.input-container:focus-within {
  border-color: #3b82f6;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.custom-textarea :deep(.el-textarea__inner) {
  box-shadow: none;
  border: none;
  background-color: transparent;
  padding: 8px 16px;
  font-size: 15px;
  line-height: 1.6;
  color: #1e293b;
  font-family: inherit;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-textarea :deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 6px;
}

.custom-textarea :deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.custom-textarea :deep(.el-textarea__inner::placeholder) {
  color: #94a3b8;
}

.footer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  margin-top: 4px;
}

.tools-left {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.icon-btn .el-icon {
  font-size: 18px;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip {
  font-size: 12px;
  color: #94a3b8;
  user-select: none;
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn.is-disabled {
  background: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
  transform: none;
}

.send-btn .el-icon {
  font-size: 18px;
}
</style>
