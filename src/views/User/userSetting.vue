<script setup>
import { getAllMessages, getPartMessages } from '@/api/chat'
import { ElMessage } from 'element-plus'

const test = async () => {
    const res = await getAllMessages()
    console.log(res)
}
const handleFileChange = (e) => {
    console.log(e.target.files[0])
}
const test2 = async () => {
    const res = await getPartMessages(40)
    console.log(res)
}

const open5 = () => {
  ElMessage({
    message: 'This is a primary message.',
    type: 'primary',
    plain: true,
  })
}
</script>

<template>
    <div>
        主页设置
        <div style="background-color: gray;">
            <input type="file" @change="handleFileChange">
        </div>
        <button @click="test()">获取所有消息</button>
        <button @click="test2()">获取部分消息</button>
        <el-button :plain="true" @click="open5">Primary</el-button>
    </div>
</template>

<style scoped>

</style>