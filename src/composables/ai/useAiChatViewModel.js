import { ref, nextTick, onMounted, computed } from 'vue'
import { useAiStore } from '@/stores/ai'
import { useAiMessagesStore } from '@/stores/aiMessages'
import { sendMessage } from '@/utils/websocket'

export const useAiChatViewModel = () => {
  const aiStore = useAiStore()
  const aiMessagesStore = useAiMessagesStore()
  const selectedChatId = computed(() => aiMessagesStore.currentThreadId)
  const chatHistory = computed(() =>
    (aiStore.aiThreads || []).map((item) => ({
      id: item.thread_id ?? item.id,
      title: item.title ?? item.name ?? '未命名对话',
      date: item.last_time ?? item.updated_at ?? item.created_at ?? '',
    })),
  )

  const messages = computed(() => aiMessagesStore.currentMessages)

  const inputMessage = ref('')
  const isSearching = ref(false)
  const isDeepThinking = ref(false)
  const isCreateDialogOpen = ref(false)

  onMounted(() => {
    aiStore.loadAiThreads()
  })

  const toggleSearch = () => {
    isSearching.value = !isSearching.value
  }

  const toggleDeepThinking = () => {
    isDeepThinking.value = !isDeepThinking.value
  }

  const handleDeleteChat = (chatId) => {
    const index = aiStore.aiThreads.findIndex((item) => item.thread_id === chatId)
    if (index > -1) {
      aiStore.aiThreads.splice(index, 1)
    }
  }

  const handleSelectChat = async (chatId) => {
    aiMessagesStore.setCurrentThreadId(chatId)
    await aiMessagesStore.loadThreadMessages(chatId)
    scrollToBottom()
  }

  const scrollbarRef = ref(null)
  const innerRef = ref(null)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollbarRef.value && innerRef.value) {
      scrollbarRef.value.setScrollTop(innerRef.value.clientHeight)
    }
  }

  const handleSend = () => {
    if (!inputMessage.value.trim()) return
    if (!aiMessagesStore.currentThreadId) return

    const content = inputMessage.value
    const threadId = aiMessagesStore.currentThreadId

    aiMessagesStore.addThreadMessage(threadId, {
      msg_id: Date.now(),
      thread_id: threadId,
      id: Date.now(),
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    inputMessage.value = ''
    scrollToBottom()

    sendMessage({
      content,
      attachment: null,
      thread_id: threadId,
      request_data: {
        is_stream: true,
      },
    })
  }

  const handleFileUpload = () => {
    console.log('Upload file clicked')
  }

  return {
    chatHistory,
    messages,
    inputMessage,
    isSearching,
    isDeepThinking,
    isCreateDialogOpen,
    toggleSearch,
    toggleDeepThinking,
    handleDeleteChat,
    handleSelectChat,
    selectedChatId,
    scrollbarRef,
    innerRef,
    handleSend,
    handleFileUpload,
  }
}
