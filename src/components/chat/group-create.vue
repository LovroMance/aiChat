<script setup>
import { ref, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useFileUpload } from '@/api/chat'
import UploadAvatar from '@/components/file/uploadAvatar.vue'

import { showErrorTip } from '@/utils/messageTips'

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: '创建群聊',
  },
  config: {
    type: Object,
    default: () => ({
      avatarLabel: '群头像',
      nameLabel: '群名称',
      namePlaceholder: '请输入群聊名称',
      descriptionLabel: '群简介',
      descriptionPlaceholder: '请输入群聊简介（可选）',
      initLabel: '初始化设置',
      initOptions: [{ label: '默认助手', value: 'default_assistant' }],
    }),
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showInitSetting: {
    type: Boolean,
    default: false,
  },
})

// 定义 emits
const emit = defineEmits(['close', 'submit'])

// 表单数据
const groupForm = ref({
  name: '',
  description: '',
  initSetting: props.showInitSetting ? props.config.initOptions?.[0]?.value || '' : '',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', // 默认头像
})

const formRef = ref(null)
const selectedFile = ref(null) // 保存选择的文件对象
const previewUrl = ref('') // 保存预览图片的 URL 用于清理
const loading = ref(false) // 内部 loading 状态

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
}

// 关闭弹窗
const closeDialog = () => {
  emit('close')
}

// 头像文件选择回调
const handleAvatarChange = (file) => {
  console.log('文件选择:', file)
  selectedFile.value = file.raw // 保存文件对象

  // 清理旧的预览 URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = URL.createObjectURL(file.raw)
  groupForm.value.avatar = previewUrl.value // 创建本地预览头像 URL
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    // 先进行表单验证
    const isValid = await formRef.value.validate()
    if (isValid) {
      loading.value = true
      // 上传新头像
      if (selectedFile.value) {
        const res = await useFileUpload(selectedFile.value)
        console.log('头像上传结果:', res)

        // 安全拼接 URL
        const path = res.data.data.startsWith('/') ? res.data.data.slice(1) : res.data.data
        const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
        groupForm.value.avatar = `${cleanBaseURL}/${path}`
      }

      // 提交给父组件处理
      emit('submit', groupForm.value)
    }
  } catch (error) {
    console.error('表单验证或文件上传失败:', error)
    showErrorTip('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="pop-up" @click.self="closeDialog">
    <div class="dialog-container">
      <!-- 对话框头部 -->
      <div class="dialog-header">
        <h2>{{ title }}</h2>
      </div>

      <!-- 对话框内容 -->
      <div class="dialog-content">
        <el-form
          ref="formRef"
          :model="groupForm"
          :rules="rules"
          label-width="80px"
          label-position="top"
          class="group-form"
        >
          <!-- 头像上传 -->
          <el-form-item v-if="showAvatar" :label="config.avatarLabel || '头像'">
            <div class="avatar-upload-wrapper">
              <UploadAvatar
                v-model="groupForm.avatar"
                :size="80"
                :showTip="false"
                @fileSelected="handleAvatarChange"
              />
              <div class="upload-tip">
                <p>支持 JPG、PNG 格式</p>
                <p>建议尺寸 200x200</p>
              </div>
            </div>
          </el-form-item>

          <!-- 名称 -->
          <el-form-item :label="config.nameLabel" prop="name">
            <el-input
              v-model="groupForm.name"
              :placeholder="config.namePlaceholder"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <!-- 初始化设置 / 简介 -->
          <el-form-item v-if="showInitSetting" :label="config.initLabel" prop="initSetting">
            <el-select v-model="groupForm.initSetting" filterable class="init-select">
              <el-option
                v-for="option in config.initOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else :label="config.descriptionLabel" prop="description">
            <el-input
              v-model="groupForm.description"
              type="textarea"
              :placeholder="config.descriptionPlaceholder"
              :rows="4"
              maxlength="500"
              show-word-limit
              resize="none"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 对话框底部 -->
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">创建</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.dialog-container {
  background: white;
  border-radius: 8px;
  width: 440px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-content {
  padding: 24px;
}

.avatar-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.upload-tip p {
  margin: 0;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element Plus 覆盖 */
:deep(.el-form-item__label) {
  padding-bottom: 8px;
  line-height: 1.2;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}
</style>
