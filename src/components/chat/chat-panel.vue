<script setup>
import { useChatPanel } from '@/composables/chat/useChatPanel'
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
</script>

<template>
  <!-- 绑定 ref -->
  <el-scrollbar ref="scrollbarRef" class="chat-panel-scroll">
    <div v-if="isLoading" class="loading-container">
      <LoadingView />
    </div>
    <div v-else class="chat-panel-content">
      <!-- 过去的聊天记录 -->
      <chat-record :messages="messageStore.beforeMessages" :userUid="userUid" />
      <!-- 离线的聊天记录 -->
      <chat-record :messages="messageStore.offlineMessages" :userUid="userUid" />
      <!-- 聊天历史提示 -->
      <div
        v-if="messageStore.beforeMessages.length || messageStore.offlineMessages.length"
        class="history-tip"
      >
        <span>———— 以上为历史聊天记录 ————</span>
      </div>
      <!-- 当前的聊天记录 -->
      <chat-record :messages="messageStore.onlineMessages" :userUid="userUid" />
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
</style>
