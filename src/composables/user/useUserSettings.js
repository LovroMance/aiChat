import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getStorage, setStorage } from '@/utils/localstorage'

const SETTINGS_KEY = 'user-settings-preferences'

const defaultSettings = {
  notification: {
    enablePush: true,
    enableSound: true,
    enableEmail: false,
  },
  privacy: {
    allowStrangers: false,
    readReceipts: true,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
  },
  misc: {
    autoLaunch: false,
  },
  language: 'zh-CN',
}

const cloneDefaults = () => JSON.parse(JSON.stringify(defaultSettings))

const mergeSection = (section, fallback) => ({
  ...fallback,
  ...(section || {}),
})

const loadSettings = () => {
  const stored = getStorage(SETTINGS_KEY) || {}
  return {
    notification: mergeSection(stored.notification, defaultSettings.notification),
    privacy: mergeSection(stored.privacy, defaultSettings.privacy),
    appearance: mergeSection(stored.appearance, defaultSettings.appearance),
    misc: mergeSection(stored.misc, defaultSettings.misc),
    language: stored.language || defaultSettings.language,
  }
}

export function useUserSettings() {
  const settings = ref(loadSettings())

  const saveSettings = () => {
    setStorage(SETTINGS_KEY, settings.value)
    ElMessage.success('设置已保存')
  }

  const resetSettings = () => {
    settings.value = cloneDefaults()
    setStorage(SETTINGS_KEY, settings.value)
    ElMessage.success('已恢复默认设置')
  }

  return {
    settings,
    saveSettings,
    resetSettings,
  }
}
