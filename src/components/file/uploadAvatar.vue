<script setup>
import { ElUpload, ElIcon, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },   // 头像URL
  accept: { type: String, default: '.png,.jpg,.jpeg' },
  maxMB: { type: Number, default: 2 },
  size: { type: Number, default: 100 },        // 统一圆形尺寸
  showTip: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'file-change'])

const previewUrl = ref(props.modelValue)

watchEffect(() => {
  previewUrl.value = props.modelValue
})

const beforeUpload = (file) => {
  const okType = ['image/jpeg', 'image/png'].includes(file.type)
  const okSize = file.size / 1024 / 1024 < props.maxMB
  if (!okType) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!okSize) {
    ElMessage.error(`头像图片大小不能超过 ${props.maxMB}MB!`)
    return false
  }
  return true
}

const onChange = (file) => {
  if (!beforeUpload(file.raw)) return
  const url = URL.createObjectURL(file.raw)
  previewUrl.value = url
  emit('update:modelValue', url)   // 回传预览URL
  emit('file-change', file.raw)    // 回传原始文件
}
</script>

<template>
  <el-upload
    class="avatar-uploader"
    :auto-upload="false"
    :show-file-list="false"
    :accept="accept"
    :on-change="onChange"
  >
    <img v-if="previewUrl" :src="previewUrl" :style="{
      width: size + 'px', height: size + 'px', borderRadius: '50%', objectFit: 'cover'
    }" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <div v-if="showTip" class="upload-tip">
    <p>支持 JPG、PNG 格式，大小不超过 {{ maxMB }}MB</p>
  </div>
</template>

<style scoped>
.avatar-uploader {
  border: 2px dashed rgba(70,130,180,0.2);
  border-radius: 50%;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
  background-color: rgba(64,158,255,0.05);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px; height: 80px;
  display: flex; align-items: center; justify-content: center;
}
.upload-tip {
  margin-top: 8px; font-size: 12px; color: #909399; text-align: center;
}
</style>