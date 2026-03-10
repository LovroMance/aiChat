<script setup>
import {
  Plus,
  Search,
  Position,
  Delete,
  Setting,
  Paperclip,
  Lightning,
  MoreFilled,
} from '@element-plus/icons-vue'
import createGroup from '@/components/chat/group-create.vue'
import { useAiChat } from '@/composables/ai/useAiChat'
import { useAiChatViewModel } from '@/composables/ai/useAiChatViewModel'

const { aiDialogAttrs, handleCreateAiChat } = useAiChat()
const {
  chatHistory,
  messages,
  inputMessage,
  isSearching,
  isDeepThinking,
  isCreateDialogOpen,
  toggleSearch,
  toggleDeepThinking,
  handleDeleteChat,
  handleSelectChat,
  selectedChatId,
  scrollbarRef,
  innerRef,
  handleScrollbarScroll,
  handleSend,
  handleFileUpload,
} = useAiChatViewModel()

const handleCreateAiChatSubmit = async (formData) => {
  try {
    await handleCreateAiChat(formData)
    isCreateDialogOpen.value = false
  } catch (error) {
    // 错误提示已由响应拦截器统一处理
    console.error('创建 AI 对话失败:', error)
  }
}
</script>

<template>
  <div class="ai-chat-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <el-button type="primary" class="new-chat-btn" @click="isCreateDialogOpen = true" round>
          <el-icon><Plus /></el-icon>
          <span>新对话</span>
        </el-button>
      </div>

      <!-- Create Dialog -->
      <createGroup
        v-if="isCreateDialogOpen"
        :title="aiDialogAttrs.title"
        :config="aiDialogAttrs.config"
        :show-init-setting="true"
        :show-avatar="false"
        @close="isCreateDialogOpen = false"
        @submit="handleCreateAiChatSubmit"
      />

      <div class="history-list">
        <div class="history-group">
          <div class="group-title">最近</div>
          <div
            v-for="item in chatHistory"
            :key="item.id"
            class="history-item"
            :class="{ 'is-active': item.id === selectedChatId }"
            @click="handleSelectChat(item.id)"
          >
            <span class="item-title">{{ item.title }}</span>
            <el-dropdown trigger="click" placement="bottom-end" @click.stop>
              <el-icon class="item-more"><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDeleteChat(item.id)">
                    <el-icon><Delete /></el-icon>
                    <span>删除对话</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="footer-item">
          <el-icon><Delete /></el-icon>
          <span>清空记录</span>
        </div>
        <div class="footer-item">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="main-area">
      <!-- Header -->
      <div class="chat-header">
        <div class="model-selector">
          <span class="model-name">AI Assistant Pro</span>
          <el-tag size="small" effect="plain" round>V 2.0</el-tag>
        </div>
      </div>

      <!-- Messages -->
      <div class="messages-container">
        <el-scrollbar ref="scrollbarRef" @scroll="handleScrollbarScroll">
          <div ref="innerRef" class="messages-inner">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-wrapper"
              :class="{ 'is-user': msg.role === 'user' }"
            >
              <div class="message-content">
                <div class="bubble">
                  <div
                    v-if="msg.role === 'assistant' && msg.reasoning_content"
                    class="reasoning-block"
                  >
                    <div class="reasoning-title">思考过程</div>
                    <div class="reasoning-text">{{ msg.reasoning_content }}</div>
                  </div>
                  <div class="answer-text">{{ msg.content }}</div>
                </div>
                <div class="time">{{ msg.time }}</div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-box">
          <div class="toolbar">
            <el-button
              :type="isSearching ? 'primary' : 'default'"
              size="small"
              @click="toggleSearch"
              class="feature-btn"
            >
              <el-icon><Search /></el-icon>
              <span>联网搜索</span>
            </el-button>

            <el-button
              :type="isDeepThinking ? 'primary' : 'default'"
              size="small"
              @click="toggleDeepThinking"
              class="feature-btn"
            >
              <el-icon><Lightning /></el-icon>
              <span>深度思考</span>
            </el-button>

            <el-button size="small" @click="handleFileUpload" class="feature-btn">
              <el-icon><Paperclip /></el-icon>
              <span>上传附件</span>
            </el-button>
          </div>

          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入您的问题..."
            resize="none"
            class="chat-input"
            @keydown.enter.prevent="handleSend"
          />

          <div class="send-actions">
            <el-button type="primary" circle :disabled="!inputMessage.trim()" @click="handleSend">
              <el-icon><Position /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="disclaimer">AI 生成的内容可能不准确，请核对重要信息。</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f4f6f8;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  color: #1a1a1a;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  z-index: 10;
}

.sidebar-header {
  margin-bottom: 28px;
}

.new-chat-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, #4f8df9 0%, #3b76f6 100%);
}

.new-chat-btn:active {
  transform: translateY(0);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* Custom Scrollbar for history list */
.history-list::-webkit-scrollbar {
  width: 4px;
}
.history-list::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 4px;
}
.history-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 12px;
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s ease;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
}

.history-item:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.history-item.is-active {
  background-color: #eff6ff;
  color: #1e40af;
}

.history-item.is-active .item-more {
  opacity: 1;
  color: #3b82f6;
}

.item-icon {
  margin-right: 12px;
  color: #94a3b8;
  font-size: 16px;
}

.history-item:hover .item-icon {
  color: #3b82f6;
}

.item-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.item-more {
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  flex-shrink: 0;
}

.history-item:hover .item-more {
  opacity: 1;
}

.item-more:hover {
  color: #3b82f6;
}

.sidebar-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 20px;
  margin-top: 20px;
}

.footer-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  color: #64748b;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.footer-item:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.footer-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* Main Area Styles */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  position: relative;
}

.chat-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
}

.model-selector {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  cursor: pointer;
}

.model-selector:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.model-name {
  font-weight: 600;
  color: #334155;
  margin-right: 8px;
  font-size: 15px;
}

/* Messages Styles */
.messages-container {
  flex: 1;
  overflow: hidden;
  background-color: #ffffff;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 24px 24px;
}

.messages-inner {
  padding: 40px 0;
  max-width: 840px;
  margin: 0 auto;
}

.message-wrapper {
  display: flex;
  margin-bottom: 32px;
  padding: 0 24px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-wrapper.is-user {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 16px;
  max-width: 75%;
}

.bubble {
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  position: relative;
}

.reasoning-block {
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.reasoning-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.answer-text {
  white-space: pre-wrap;
}

.message-wrapper:not(.is-user) .bubble {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
  border-top-left-radius: 4px;
}

.message-wrapper.is-user .bubble {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-top-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 6px;
  font-weight: 500;
}

.message-wrapper.is-user .time {
  text-align: right;
}

.input-area {
  padding: 24px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
}

.input-box {
  max-width: 840px;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.input-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.toolbar {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.feature-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 110px;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.feature-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.feature-btn .el-icon {
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  background-color: transparent;
  padding: 16px 20px;
  font-size: 16px;
  color: #1e293b;
  line-height: 1.6;
}

.chat-input :deep(.el-textarea__inner::placeholder) {
  color: #94a3b8;
}

.send-actions {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.send-actions .el-button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  transition: all 0.2s;
}

.send-actions .el-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.send-actions .el-button:disabled {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

.disclaimer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 16px;
  font-weight: 500;
}
</style>
