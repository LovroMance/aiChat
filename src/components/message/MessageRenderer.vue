<script setup>
import { computed } from 'vue'
import { MESSAGE_SCENES } from '@/core/message/messageTypes'
import { resolveRenderedMessage } from '@/core/message/messageBus'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  scene: {
    type: String,
    default: MESSAGE_SCENES.CHAT,
  },
})

const resolvedMessage = computed(() => resolveRenderedMessage(props.scene, props.message))
</script>

<template>
  <component
    :is="resolvedMessage.renderer"
    v-if="resolvedMessage.renderer"
    :message="resolvedMessage"
  />
  <span v-else>{{ resolvedMessage.content }}</span>
</template>
