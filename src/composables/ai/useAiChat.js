import { reactive } from 'vue'
import { createAiChat } from '@/api/ai'
import { addData, AI_THREADS_STORE } from '@/utils/indexedDB'
import { useAiStore } from '@/stores/ai'
import { showSuccessTip, showErrorTip } from '@/utils/messageTips'

export function useAiChat() {
  const aiStore = useAiStore()
  // 新建智能体对话框属性
  const aiDialogAttrs = reactive({
    title: '新建智能体对话',
    showAvatar: false,
    config: {
      nameLabel: '智能体名称',
      namePlaceholder: '请输入智能体名称',
      initLabel: '初始化设置',
      initOptions: [
        { label: '默认助手', value: 'default_assistant' },
        { label: '代码助手', value: 'code_assistant' },
        { label: '写作助手', value: 'writing_assistant' },
        { label: '翻译助手', value: 'translation_assistant' },
        { label: '学习辅导', value: 'study_tutor' },
      ],
    },
  })

  // 创建智能体对话
  const handleCreateAiChat = async (formData) => {
    try {
      const { data } = await createAiChat(formData)
      const threadId = data?.thread_id
      if (threadId) {
        const threadPayload = {
          thread_id: threadId,
          name: formData?.name || '未命名对话',
        }
        await addData(AI_THREADS_STORE, threadPayload)
        aiStore.upsertAiThread(threadPayload)
      }
      console.log('创建群聊成功:', data)
      showSuccessTip('群聊创建成功！')
      return true
    } catch (error) {
      console.error('创建群聊失败:', error)
      showErrorTip('创建群聊失败，请重试')
      return false
    }
  }

  return {
    aiDialogAttrs,
    handleCreateAiChat,
  }
}
