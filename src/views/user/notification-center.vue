<script setup>
import NotificationCard from '@/components/notification/notification-card.vue'
import { useNoticeCenter } from '@/composables/notice/useNoticeCenter'

const { notifications, tabOptions, handleCardAction } = useNoticeCenter()
</script>

<template>
  <section class="notification-page">
    <header class="page-header">
      <div>
        <h2 class="page-title">通知中心</h2>
        <p class="page-subtitle">管理系统通知与消息提醒</p>
      </div>
      <div class="header-actions">
        <span class="unread-badge">12 条未读</span>
        <button class="header-btn" type="button">全部标为已读</button>
      </div>
    </header>

    <div class="tab-row">
      <button
        v-for="(tab, index) in tabOptions"
        :key="tab"
        :class="['tab-btn', { active: index === 0 }]"
        type="button"
      >
        {{ tab }}
      </button>
    </div>

    <div class="card-list">
      <NotificationCard
        v-for="item in notifications"
        :key="item.notice_id || item.id"
        :notification="item"
        @action="handleCardAction"
      />
    </div>
  </section>
</template>

<style scoped>
.notification-page {
  height: 100vh;
  box-sizing: border-box;
  background: #f8fbff;
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions,
.tab-row {
  display: flex;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}

.header-actions {
  gap: 12px;
}

.unread-badge {
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.header-btn {
  min-height: 36px;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.tab-row {
  gap: 10px;
}

.tab-btn {
  min-height: 38px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.tab-btn.active {
  border-color: transparent;
  background: #2563eb;
  color: #ffffff;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.card-list::-webkit-scrollbar {
  width: 6px;
}

.card-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 8px;
}

.card-list::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 900px) {
  .notification-page {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
