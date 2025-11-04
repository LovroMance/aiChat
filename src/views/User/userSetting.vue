<script setup>
import { getUnreadMessages } from '@/api/chat'
import { formatTimeHour } from '@/utils/format'
import { getMessagesByThreadId, getRecentMessagesByThreadId } from '@/utils/indexedDB'

const chatListStore = useUnreadMessagesStore()

const test = async (existing_id = 0) => {
  console.log(existing_id)
  const { data } = await getUnreadMessages({
    existing_id,
  })
  console.log(data)

  console.log('API响应:', data)

  // 遍历响应数据的不同方式：

  // 方式1：遍历整个响应对象的属性
  for (const key in data) {
    const value = data[key]
    const valueObject = {
      thread_id: value.thread_id,
      thread_name: value.thread_info.name,
      thread_avatar: value.thread_info.avatar,
      senderName: value.latest_message.sender_name,
      content: value.latest_message.content,
      lastTime: formatTimeHour(value.latest_message.update_time),
      unreadCount: value.unread_count,
      type: value.thread_info.type,
    }
    console.log(valueObject)
    chatListStore.unreadMessagesMap.set(valueObject.thread_id, valueObject) // 将未读消息存到store中
  }
  console.log('map', chatListStore.unreadMessagesMap)
}

const test2 = async () => {
  const messages = await getMessagesByThreadId(2)
  console.log(messages)
}

const test3 = async () => {
  const messages = await getRecentMessagesByThreadId(1)
  console.log(messages)
}

const test4 = async () => {
  console.log('map', unreadMessagesStore.unreadMessagesMap)
}

const test5 = async () => {
  console.log('get', unreadMessagesStore.unreadMessagesMap.get(8))
}

import { useUnreadMessagesStore } from '@/stores'
import { onMounted } from 'vue'
const unreadMessagesStore = useUnreadMessagesStore()
onMounted(() => {
  unreadMessagesStore.loadUnreadMessagesFromDB()
})

import { putRecord } from '@/service/unreadMessageService'
const test6 = () => {
  putRecord({
    thread_id: 1,
    sender_name: 'hi',
    content: 'hello',
    lastTime: '2022-01-01 00:00:00',
  })
}
</script>

<template>
  <div>
    <button @click="test()">接口测试</button>
    <button @click="test2()">获取指定thread_id信息</button>
    <button @click="test3()">获取指定thread_id部分信息</button>
    <button @click="test4()">test</button>
    <button @click="test5()">get</button>

    <button @click="test6()">map方法测试</button>
  </div>
</template>

<style scoped></style>
