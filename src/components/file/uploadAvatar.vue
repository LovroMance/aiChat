<script setup>
import { ElUpload, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 头像URL
  accept: { type: String, default: '.png,.jpg,.jpeg' },
  size: { type: Number, default: 100 }, // 统一圆形尺寸
  showTip: { type: Boolean, default: false }, // 是否显示上传提示
})

// 传回本地预览
const emit = defineEmits(['update:modelValue', 'fileSelected'])

const previewUrl = ref(props.modelValue)

watchEffect(() => {
  previewUrl.value = props.modelValue
})

const onChange = (file) => {
  previewUrl.value = URL.createObjectURL(file.raw)
  emit('update:modelValue', previewUrl.value) // 回传预览URL
  emit('fileSelected', file)
}
</script>

<template>
  <div class="upload-avatar-wrapper">
    <el-upload
      class="avatar-uploader"
      :style="{ width: size + 'px', height: size + 'px' }"
      :auto-upload="false"
      :show-file-list="false"
      :accept="accept"
      :on-change="onChange"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        :style="{ width: size + 'px', height: size + 'px' }"
        class="avatar-img"
      />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div v-if="showTip" class="upload-tip">
      <slot name="tip"> </slot>
    </div>
  </div>
</template>

<style scoped>
.upload-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-uploader {
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  transition: border-color 0.3s;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-img {
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}
</style>
