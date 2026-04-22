<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatTime } from '@/utils/format'
import MessageRenderer from '@/components/message/MessageRenderer.vue'
import { MESSAGE_SCENES } from '@/core/message/messageTypes'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  userUid: {
    type: [String],
    required: true,
  },
  scene: {
    type: String,
    default: MESSAGE_SCENES.CHAT,
  },
})

const emit = defineEmits(['retry', 'measure'])

const rootRef = ref(null)
let resizeObserver = null

const statusTextMap = {
  queued: '待发送',
  sending: '发送中',
  failed: '发送失败',
  sent: '已发送',
}

const getStatusText = (msg) => {
  return statusTextMap[msg?.delivery_status] || ''
}

const isRetryable = (msg) => {
  return msg?.delivery_status === 'failed' && msg?.client_message_id
}

const emitMeasure = async () => {
  await nextTick()
  const height = rootRef.value?.offsetHeight
  if (!height) return
  emit('measure', {
    message_id: props.message.message_id,
    height,
  })
}

onMounted(() => {
  emitMeasure()

  if (typeof ResizeObserver === 'undefined' || !rootRef.value) return

  resizeObserver = new ResizeObserver(() => {
    emitMeasure()
  })
  resizeObserver.observe(rootRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div
    ref="rootRef"
    :class="['chat-message', props.message.sender_uid === props.userUid ? 'self' : 'other']"
  >
    <img class="avatar" :src="props.message.sender_avatar" :alt="props.message.sender_name" />
    <div class="message-content">
      <div
        class="username-time"
        :class="props.message.sender_uid === props.userUid ? 'self' : ''"
      >
        <span class="username">{{ props.message.sender_name }}</span>
        <span :class="props.message.sender_uid === props.userUid ? 'right-time' : 'left-time'">
          {{ formatTime(props.message.create_time) }}
        </span>
      </div>
      <div class="content">
        <MessageRenderer :message="props.message" :scene="props.scene" />
      </div>
      <div
        v-if="props.message.sender_uid === props.userUid && props.message.delivery_status"
        :class="['message-status', props.message.delivery_status]"
      >
        <span>{{ getStatusText(props.message) }}</span>
        <button
          v-if="isRetryable(props.message)"
          type="button"
          class="retry-btn"
          @click="emit('retry', props.message.client_message_id)"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 22px;
  padding: 0 24px;
}

.chat-message.other {
  flex-direction: row;
}

.chat-message.self {
  flex-direction: row-reverse;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1.5px solid #b2dfdb;
  background: #fff;
}

.message-content {
  max-width: 340px;
  background: #fff;
  border-radius: 22px 22px 22px 6px;
  padding: 14px 20px 10px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: background 0.3s;
  min-width: 180px;
}

.chat-message.self .message-content {
  border-radius: 22px 22px 6px 22px;
  box-shadow: 0 2px 12px rgba(44, 185, 176, 0.08);
}

.username-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.username-time.self {
  flex-direction: row-reverse;
}

.username {
  font-weight: 500;
  color: #4a6fa5;
  font-size: 14px;
  opacity: 0.85;
}

.chat-message.self .username {
  color: #2e7d6b;
  opacity: 0.85;
}

.left-time {
  font-size: 12px;
  color: #5d6371;
  margin-left: 8px;
  opacity: 0.7;
}

.right-time {
  font-size: 12px;
  color: #5d6371;
  margin-right: 8px;
  opacity: 0.7;
}

.content {
  font-size: 16px;
  color: #35505a;
  word-break: break-all;
  line-height: 1.8;
  letter-spacing: 0.01em;
  margin-top: 2px;
  min-height: 28.79px;
}

.chat-message.self .content {
  color: #236d5e;
}

.message-status {
  margin-top: 8px;
  font-size: 12px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.message-status.failed {
  color: #d35454;
}

.message-status.sending,
.message-status.queued {
  color: #8d6e63;
}

.retry-btn {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
}
</style>
