<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const codeBlockPattern = /```([\w-]+)?\n([\s\S]+?)```/
const matched = props.message.content.match(codeBlockPattern)
const language = matched?.[1] || 'text'
const code = matched?.[2] || props.message.content
</script>

<template>
  <div class="code-message">
    <div class="code-header">{{ language }}</div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-message {
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  background-color: #0f172a;
}

.code-header {
  padding: 8px 12px;
  font-size: 12px;
  color: #cbd5e1;
  background-color: rgba(148, 163, 184, 0.14);
  text-transform: lowercase;
}

.code-message pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e2e8f0;
  line-height: 1.7;
}
</style>
