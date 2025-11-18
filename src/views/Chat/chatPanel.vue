<script setup>
import { watch, nextTick } from 'vue'
import { useMessageStore } from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import chatRecord from '@/components/chat/chatRecord.vue'

const messageStore = useMessageStore()
const userUid = getStorage(USER_LOGIN_INFO).uid

// 监听消息变化，自动滚动到底部
watch(
  () => [...messageStore.onlineMessages],
  () => {
    nextTick(() => {
      const chatPanel = document.querySelector('.el-scrollbar__thumb')
      if (chatPanel) {
        chatPanel.scrollTop = chatPanel.scrollHeight
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <el-scrollbar class="chat-panel" style="height: 100%">
    <!-- 过去的聊天记录 -->
    <chat-record :messages="messageStore.beforeMessages" :userUid="userUid" />
    <!-- 离线的聊天记录 -->
    <chat-record :messages="messageStore.offlineMessages" :userUid="userUid" />
    <!-- 聊天历史提示 -->
    <div
      v-if="messageStore.beforeMessages.length || messageStore.offlineMessages.length"
      class="history-tip"
    >
      ———— 以上为历史聊天记录 ————
    </div>
    <!-- 当前的聊天记录 -->
    <chat-record :messages="messageStore.onlineMessages" :userUid="userUid" />
  </el-scrollbar>
</template>

<style scoped>
.chat-panel {
  width: 100%;
  height: 100%;
  /* 只保留左右内边距，去掉上下 */
  padding: 16px 24px 0px;
  background: linear-gradient(120deg, #f3fbfe 0%, #eafaf6 100%);
  box-sizing: border-box;
}

.history-tip {
  text-align: center;
  color: #8fa3b7;
  font-size: 15px;
  margin: 18px 0 12px 0;
  letter-spacing: 2px;
  user-select: none;
}
</style>
