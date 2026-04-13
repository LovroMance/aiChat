<script setup>
import { useChatPanel } from '@/composables/chat/useChatPanel'
import { retryPendingChatMessage } from '@/core/chatSend'
import { useMessageStore } from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import chatRecord from '@/components/chat/chat-record.vue'
import LoadingView from '@/components/feedback/LoadingView.vue'

const messageStore = useMessageStore()
const userUid = getStorage(USER_LOGIN_INFO).uid

const { scrollbarRef, isLoading, scrollToBottom, scrollToTop, setLoading } =
  useChatPanel(messageStore)

defineExpose({
  scrollToBottom,
  scrollToTop,
  setLoading,
})

const handleRetry = async (clientMessageId) => {
  await retryPendingChatMessage(clientMessageId)
}
</script>

<template>
  <!-- 绑定 ref -->
  <el-scrollbar ref="scrollbarRef" class="chat-panel-scroll">
    <div v-if="isLoading" class="loading-container">
      <LoadingView />
    </div>
    <div v-else class="chat-panel-content">
      <!-- 顶部分页提示：本地还有未展开历史时提示上滑。 -->
      <div
        v-if="messageStore.historyStatus.hiddenLocalCount > 0"
        class="history-loading-tip"
      >
        <span>上滑加载更早消息（剩余 {{ messageStore.historyStatus.hiddenLocalCount }} 条）</span>
      </div>
      <!-- 过去的聊天记录 -->
      <chat-record :messages="messageStore.beforeMessages" :userUid="userUid" @retry="handleRetry" />
      <!-- 离线的聊天记录 -->
      <chat-record :messages="messageStore.offlineMessages" :userUid="userUid" @retry="handleRetry" />
      <div v-if="messageStore.historyStatus.syncingOffline" class="offline-sync-tip">
        <span>正在同步离线消息...</span>
      </div>
      <!-- 聊天历史提示 -->
      <div
        v-if="messageStore.beforeMessages.length || messageStore.offlineMessages.length"
        class="history-tip"
      >
        <span>———— 以上为历史聊天记录 ————</span>
      </div>
      <!-- 当前在线消息始终放在底部区域，保证发送和实时收消息的阅读顺序稳定。 -->
      <chat-record :messages="messageStore.onlineMessages" :userUid="userUid" @retry="handleRetry" />
    </div>
  </el-scrollbar>
</template>

<style scoped>
.chat-panel-scroll {
  height: 100%;
  width: 100%;
}

.loading-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chat-panel-content {
  padding: 20px 24px;
  /* 移除背景色，由父容器控制，或者使用透明/白色 */
  box-sizing: border-box;
  min-height: 100%;
}

.history-tip {
  text-align: center;
  margin: 24px 0;
}

.history-tip span {
  font-size: 12px;
  color: #999;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 12px;
  border-radius: 12px;
}

.history-loading-tip,
.offline-sync-tip {
  text-align: center;
  margin: 0 0 18px;
}

.history-loading-tip span,
.offline-sync-tip span {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #64748b;
  background-color: #eef2ff;
}
</style>
