import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Service, UserFilled } from '@element-plus/icons-vue'

/**
 * 联系人/群组列表的视图逻辑
 * 负责：筛选、搜索、跳转占位
 */
export function useContactList() {
  const contacts = ref([
    {
      id: 1,
      name: '张三',
      avatar: 'https://avatars.githubusercontent.com/u/9919?s=48',
      lastMessage: '待会儿一起评审接口文档',
      lastTime: '10:30',
      unread: 2,
      type: 'friend',
    },
    {
      id: 2,
      name: '前端重构群',
      avatar: 'https://avatars.githubusercontent.com/u/139426?s=48',
      lastMessage: '李四: 今晚合并 PR',
      lastTime: '09:12',
      unread: 5,
      type: 'group',
    },
    {
      id: 3,
      name: 'AI 助手',
      avatar: 'https://avatars.githubusercontent.com/u/6154722?v=4',
      lastMessage: '我可以帮你整理会议纪要',
      lastTime: '08:05',
      unread: 0,
      type: 'ai',
    },
    {
      id: 4,
      name: '产品讨论群',
      avatar: 'https://avatars.githubusercontent.com/u/9919?s=48',
      lastMessage: '王五: 新原型已更新',
      lastTime: '昨天',
      unread: 0,
      type: 'group',
    },
    {
      id: 5,
      name: '李四',
      avatar: 'https://avatars.githubusercontent.com/u/810438?v=4',
      lastMessage: '收到，我看看',
      lastTime: '昨天',
      unread: 1,
      type: 'friend',
    },
    {
      id: 6,
      name: '数据同步机器人',
      avatar: 'https://avatars.githubusercontent.com/u/9919?s=48',
      lastMessage: '同步完成：3 条新增',
      lastTime: '2天前',
      unread: 0,
      type: 'ai',
    },
  ])

  const query = ref('')
  const activeTab = ref('all')

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'friend', label: '好友' },
    { key: 'group', label: '群聊' },
    { key: 'ai', label: 'AI' },
  ]

  const filteredContacts = computed(() => {
    let list = contacts.value
    if (activeTab.value !== 'all') list = list.filter((c) => c.type === activeTab.value)
    if (query.value.trim()) {
      const q = query.value.trim().toLowerCase()
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
      )
    }
    return list
  })

  const activeLabel = computed(() => tabs.find((t) => t.key === activeTab.value)?.label || '全部')

  const handleSearch = () => {
    if (!query.value.trim()) {
      ElMessage({ type: 'warning', message: '请输入关键词' })
      return
    }
    // 这里可接入后端：搜索用户 / 群聊 / AI
    ElMessage({ type: 'info', message: `搜索 / 添加逻辑：${query.value}` })
  }

  const openChat = (c) => {
    ElMessage({ type: 'success', message: `打开会话：${c.name}` })
    // 可在此处路由跳转
  }

  const typeBadgeText = (type) => (type === 'friend' ? '好友' : type === 'group' ? '群' : 'AI')

  const typeIcon = (type) =>
    type === 'friend' ? UserFilled : type === 'group' ? ChatDotRound : Service

  return {
    // state
    contacts,
    query,
    activeTab,
    tabs,
    filteredContacts,
    activeLabel,

    // actions
    handleSearch,
    openChat,
    typeBadgeText,
    typeIcon,
  }
}
