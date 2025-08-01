<script setup>
const handleFileChange = (e) => {
    console.log(e.target.files[0])
}
</script>

<template>
    <div>
        主页设置
        <div style="background-color: gray;">
            <input type="file" @change="handleFileChange">
        </div>
    </div>
</template>

<style scoped>

</style>