<script setup>
import { useChatPanel } from '@/composables/chat/useChatPanel'
import { useChatVirtualMessages } from '@/composables/chat/useChatVirtualMessages'
import { useVirtualChatList } from '@/composables/chat/useVirtualChatList'
import { retryPendingChatMessage } from '@/core/chatSend'
import { useMessageStore } from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import chatMessageItem from '@/components/chat/chat-message-item.vue'
import LoadingView from '@/components/feedback/LoadingView.vue'
import { MESSAGE_SCENES } from '@/core/message/messageTypes'

const messageStore = useMessageStore()
const userUid = getStorage(USER_LOGIN_INFO).uid
const { renderMessages, onlineMessageCount } = useChatVirtualMessages(messageStore)
const virtualList = useVirtualChatList({
  messages: renderMessages,
})
const { visibleMessages, topSpacerHeight, bottomSpacerHeight } = virtualList

const { scrollbarRef, isLoading, scrollToBottom, scrollToTop, setLoading } =
  useChatPanel(messageStore, virtualList, onlineMessageCount)

defineExpose({
  scrollToBottom,
  scrollToTop,
  setLoading,
})

const handleRetry = async (clientMessageId) => {
  await retryPendingChatMessage(clientMessageId)
}

const handleMeasure = (payload) => {
  virtualList.measureItem(payload)
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
      <div class="virtual-spacer" :style="{ height: `${topSpacerHeight}px` }"></div>
      <template v-for="item in visibleMessages" :key="item.item_id || item.message_id">
        <div v-if="item.item_type === 'history-divider'" class="history-tip">
          <span>———— 以上为历史聊天记录 ————</span>
        </div>
        <chat-message-item
          v-else
          :message="item"
          :userUid="userUid"
          :scene="MESSAGE_SCENES.CHAT"
          @retry="handleRetry"
          @measure="handleMeasure"
        />
      </template>
      <div class="virtual-spacer" :style="{ height: `${bottomSpacerHeight}px` }"></div>
      <div v-if="messageStore.historyStatus.syncingOffline" class="offline-sync-tip">
        <span>正在同步离线消息...</span>
      </div>
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

.virtual-spacer {
  width: 100%;
}
</style>
