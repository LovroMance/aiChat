<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="ai-reply-message">
    <div v-if="props.message.meta?.reasoningContent" class="reasoning-block">
      <div class="reasoning-title">思考过程</div>
      <div class="reasoning-text">{{ props.message.meta.reasoningContent }}</div>
    </div>
    <div class="answer-text">{{ props.message.content }}</div>
  </div>
</template>

<style scoped>
.ai-reply-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reasoning-block {
  padding: 12px 14px;
  border-radius: 12px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.reasoning-title {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.answer-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
}
</style>
