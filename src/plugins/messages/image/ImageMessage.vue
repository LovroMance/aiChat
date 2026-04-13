<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const imageSource = props.message.meta?.attachment?.url || props.message.content
</script>

<template>
  <div class="image-message">
    <img :src="imageSource" alt="message image" />
  </div>
</template>

<style scoped>
.image-message img {
  display: block;
  max-width: 100%;
  max-height: 320px;
  border-radius: 14px;
  object-fit: cover;
}
</style>
