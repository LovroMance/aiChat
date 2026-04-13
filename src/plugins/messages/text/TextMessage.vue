<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="text-message">{{ props.message.content }}</div>
</template>

<style scoped>
.text-message {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
}
</style>
