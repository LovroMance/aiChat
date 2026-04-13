<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="unsupported-message">
    暂不支持的消息类型：{{ props.message.type || 'unknown' }}
  </div>
</template>

<style scoped>
.unsupported-message {
  color: #64748b;
  line-height: 1.6;
}
</style>
