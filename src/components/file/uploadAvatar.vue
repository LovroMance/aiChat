<script setup>
import { ElUpload, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 头像URL
  accept: { type: String, default: '.png,.jpg,.jpeg' },
  size: { type: Number, default: 100 }, // 统一圆形尺寸
  showTip: { type: Boolean, default: false },  // 是否显示上传提示
})

// 传回本地预览
const emit = defineEmits(['update:modelValue', 'fileSelected'])

const previewUrl = ref(props.modelValue)

watchEffect(() => {
  previewUrl.value = props.modelValue
})

// TODO：这里要做的是上传前校验
// const beforeUpload = (file) => {
//   const okType = ['image/jpeg', 'image/png'].includes(file.type)
//   const okSize = file.size / 1024 / 1024 < props.maxMB
//   if (!okType) {
//     ElMessage.error('头像图片只能是 JPG/PNG 格式!')
//     return false
//   }
//   if (!okSize) {
//     ElMessage.error(`头像图片大小不能超过 ${props.maxMB}MB!`)
//     return false
//   }
//   return true
// }

const onChange = (file) => {
  // if (!beforeUpload(file.raw)) return
  previewUrl.value = URL.createObjectURL(file.raw)
  emit('update:modelValue', previewUrl.value) // 回传预览URL
  emit('fileSelected', file)
}
</script>

<template>
    <el-upload
    class="avatar-uploader"
    :style="{ width: size + 'px', height: size + 'px' }"
    :auto-upload="false"
    :show-file-list="false"
    :accept="accept"
    :on-change="onChange"
  >
    <img v-if="previewUrl" :src="previewUrl" :style="{ width: size + 'px', height: size + 'px' }" class="avatar-img" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <div v-if="showTip" class="upload-tip">
    <slot name="tip">
    </slot>
  </div>
</template>

<style scoped>
.avatar-uploader {
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.avatar-img {
  border-radius: 50%;
  object-fit: cover;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}
</style>
