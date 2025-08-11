<script setup>
import { ElMessage } from 'element-plus'

const handleFileChange = (e) => {
    console.log(e.target.files[0])
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
        <el-button :plain="true" @click="open5">Primary</el-button>
    </div>
</template>

<style scoped>

</style>