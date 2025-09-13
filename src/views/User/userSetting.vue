<script setup>
import { getPartMessages } from '@/api/chat'
const getPart = async () => {
    const res = await getPartMessages()
    console.log(res)
}

import { getDefaultChannel } from '@/api/channel'
const getDefault = async () => {
    const res = await getDefaultChannel()
    console.log(res)
}
</script>

<template>
    <div>
        <button @click="getPart()">获取过去聊天记录</button>
        <button @click="getDefault()">获取默认频道</button>
    </div>
</template>

<style scoped>

</style>