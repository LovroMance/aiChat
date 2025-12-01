<script setup>
const test = () => {
  console.log(Math.floor(Date.now() / 1000))
}
</script>

<template>
  <div>
    <button @click="test()">接口测试</button>
  </div>
</template>

<style scoped></style>
