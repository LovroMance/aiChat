<script setup>
import { formatTime } from '@/utils/format';

// 变更：规范 props 名称与类型，增加 userUid（当前用户 id）
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  userUid: {
    type: [String],
    required: true,
  },
})
</script>

<template>
  <div>
    <div
      v-for="msg in props.messages"
      :key="msg.message_id"
      :class="['chat-message', msg.sender_uid === props.userUid ? 'self' : 'other']"
    >
      <img class="avatar" :src="msg.sender_avatar" :alt="msg.sender_name" />
      <div class="message-content">
        <div class="username-time" :class="msg.sender_uid === props.userUid ? 'self' : ''">
          <span class="username">{{ msg.sender_name }}</span>
          <span :class="msg.sender_uid === props.userUid ? 'right-time' : 'left-time'">{{
            formatTime(msg.create_time)
          }}</span>
        </div>
        <div class="content">{{ msg.content }}</div>
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
</style>
