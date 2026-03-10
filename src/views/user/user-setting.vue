<script setup>
import { ref } from 'vue'
import { useUserSettings } from '@/composables/user/useUserSettings'
import { useUserStore } from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'

const { settings, saveSettings, resetSettings } = useUserSettings()
const userStore = useUserStore()
const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  try {
    await saveSettings()
  } catch (error) {
    // 错误提示已由调用链统一处理
    console.error('保存设置失败:', error)
  } finally {
    isSaving.value = false
  }
}

const handleReset = () => {
  resetSettings()
}

import { sendFriendRequest } from '@/api/relationship'
const test = async () => {
  console.log('=== compare start ===')
  const request_data = {
    acceptor_uid: '879b5c25-106b-49e1-8dd8-5ce0f5efd34d',
    message: '你好，我想加你为好友！',
  }
  const storedToken = getStorage(USER_LOGIN_INFO)?.token
  const authToken = userStore.token || storedToken || ''
  console.log('[debug] token source:', userStore.token ? 'store' : storedToken ? 'storage' : 'none')
  if (authToken) {
    console.log('[debug] token preview:', `${authToken.slice(0, 12)}...`)
  }

  const timeoutRace = (promise, label, timeout = 8000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`${label}-timeout-${timeout}ms`)), timeout)
      }),
    ])
  }

  const axiosJob = (async () => {
    console.log('[axios] start')
    try {
      const result = await timeoutRace(sendFriendRequest(request_data), 'axios')
      console.log('[axios] resolved', result)
    } catch (error) {
      console.log('[axios] rejected', error)
    } finally {
      console.log('[axios] finally')
    }
  })()

  const fetchJob = (async () => {
    console.log('[fetch] start')
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      const response = await fetch('/relation/send-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `JWT ${authToken}` } : {}),
        },
        body: JSON.stringify(request_data),
        signal: controller.signal,
      })
      clearTimeout(timer)
      const text = await response.text()
      console.log('[fetch] resolved', {
        ok: response.ok,
        status: response.status,
        body: text,
      })
    } catch (error) {
      console.log('[fetch] rejected', error)
    } finally {
      console.log('[fetch] finally')
    }
  })()

  await Promise.allSettled([axiosJob, fetchJob])
  console.log('=== compare end ===')
}
</script>

<template>
  <div class="settings-page">
    <button @click="test">测试</button>
    <h2 class="page-title">个人设置</h2>

    <el-card class="settings-card" shadow="never">
      <div class="section-header">
        <div>
          <div class="section-title">通知与提醒</div>
          <div class="section-desc">配置推送、声音及邮件提醒方式</div>
        </div>
        <el-tag type="success" size="small">即时生效</el-tag>
      </div>

      <el-form label-width="140px" class="settings-form">
        <el-form-item label="推送通知">
          <el-switch
            v-model="settings.notification.enablePush"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="提示音">
          <el-switch
            v-model="settings.notification.enableSound"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="邮件提醒">
          <el-switch
            v-model="settings.notification.enableEmail"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card" shadow="never">
      <div class="section-header">
        <div>
          <div class="section-title">隐私与安全</div>
          <div class="section-desc">控制陌生人添加与已读回执</div>
        </div>
      </div>

      <el-form label-width="140px" class="settings-form">
        <el-form-item label="允许陌生人发起会话">
          <el-switch
            v-model="settings.privacy.allowStrangers"
            active-text="允许"
            inactive-text="拒绝"
          />
        </el-form-item>
        <el-form-item label="发送已读回执">
          <el-switch
            v-model="settings.privacy.readReceipts"
            active-text="发送"
            inactive-text="不发送"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card" shadow="never">
      <div class="section-header">
        <div>
          <div class="section-title">外观与显示</div>
          <div class="section-desc">主题、字号等显示偏好</div>
        </div>
      </div>

      <el-form label-width="140px" class="settings-form">
        <el-form-item label="主题模式">
          <el-radio-group v-model="settings.appearance.theme">
            <el-radio-button label="light">浅色</el-radio-button>
            <el-radio-button label="dark">深色</el-radio-button>
            <el-radio-button label="system">跟随系统</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字号">
          <el-radio-group v-model="settings.appearance.fontSize">
            <el-radio label="small">小</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="large">大</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card" shadow="never">
      <div class="section-header">
        <div>
          <div class="section-title">语言与其他</div>
          <div class="section-desc">语言及启动项偏好</div>
        </div>
      </div>

      <el-form label-width="140px" class="settings-form">
        <el-form-item label="界面语言">
          <el-select v-model="settings.language" placeholder="选择语言" style="width: 200px">
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </el-form-item>
        <el-form-item label="开机自启动">
          <el-switch v-model="settings.misc.autoLaunch" active-text="开启" inactive-text="关闭" />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="actions">
      <el-button @click="handleReset">恢复默认</el-button>
      <el-button type="primary" :loading="isSaving" @click="handleSave">保存设置</el-button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 16px;
}

.settings-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
}

.section-desc {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}

.settings-form {
  padding-top: 4px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>
