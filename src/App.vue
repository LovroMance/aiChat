<script setup>
import { onMounted, onUnmounted } from 'vue'
import { closeWebSocket } from '@/utils/websocket'

const cleanupSocket = () => {
  closeWebSocket()
}

onMounted(() => {
  window.addEventListener('beforeunload', cleanupSocket)
  window.addEventListener('pagehide', cleanupSocket)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', cleanupSocket)
  window.removeEventListener('pagehide', cleanupSocket)
  cleanupSocket()
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
