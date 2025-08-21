<script setup>
import { getPartMessages } from '@/api/chat'
const getPart = async () => {
    const res = await getPartMessages()
    console.log(res)
}

</script>

<template>
    <div>
        <button @click="getPart()">获取过去聊天记录</button>
    </div>
</template>

<style scoped>

</style>