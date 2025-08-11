<script setup>
import { onUnmounted } from 'vue'
import { useUserStore } from '@/stores/index'
import { clearStorage } from '@/utils/localstorage'
const userStore = useUserStore()

onUnmounted(() => {
  userStore.clearLoginInfo()
  clearStorage()
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
