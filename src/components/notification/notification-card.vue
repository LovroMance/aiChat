<script setup>
import { formatTime } from '@/utils/format'

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['action'])

const toneClassMap = {
  blue: 'tone-blue',
  green: 'tone-green',
  red: 'tone-red', // 用红色代替 cyan，用来表示拒绝等状态
}

const buttonClassMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
}

const getToneClass = (tone) => toneClassMap[tone] || toneClassMap.blue
const getButtonClass = (variant) => buttonClassMap[variant] || buttonClassMap.secondary

const handleAction = (actionKey) => {
  emit('action', {
    actionKey,
    notification: props.notification,
  })
}
</script>

<template>
  <article :class="['notification-card', getToneClass(notification.tone)]">
    <div class="identity-block">
      <el-avatar v-if="notification.avatar" :size="44" :src="notification.avatar" />
      <div v-else :class="['system-avatar', getToneClass(notification.tone)]">
        <el-icon :size="22">
          <component :is="notification.icon" />
        </el-icon>
      </div>

      <div class="identity-meta">
        <div class="title-row">
          <h3 class="card-title">{{ notification.title }}</h3>
          <div class="state-block">
            <span class="card-time">{{ formatTime(notification.created_time) }}</span>
            <span
              v-if="notification.status !== undefined"
              :class="[
                'status-pill',
                notification.status === 1
                  ? 'tone-green'
                  : notification.status === 2
                    ? 'tone-red'
                    : 'tone-blue',
              ]"
            >
              <span class="status-dot"></span>
              {{
                notification.status === 1
                  ? '已接受'
                  : notification.status === 2
                    ? '已拒绝'
                    : '待处理'
              }}
            </span>
          </div>
        </div>
        <p class="sub-meta">
          {{ notification.username }}
          <span v-if="notification.sender_uid" class="uid-tag"
            >UID: {{ notification.sender_uid }}</span
          >
        </p>
      </div>
    </div>

    <div class="message-box">
      <p class="message-text">{{ notification.message }}</p>
    </div>

    <div v-if="notification.status === 0 && notification.actions?.length" class="action-row">
      <button
        v-for="action in notification.actions"
        :key="action.key"
        :class="['action-btn', getButtonClass(action.variant), getToneClass(notification.tone)]"
        type="button"
        @click="handleAction(action.key)"
      >
        {{ action.label }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.notification-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-top: 5px;
}

.notification-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.notification-card.tone-blue {
  border-color: #bfdbfe;
  background: #f8fafc;
}

.notification-card.tone-green {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.notification-card.tone-red {
  border-color: #fecaca;
  background: #fef2f2;
}

.identity-block,
.title-row,
.state-block,
.action-row {
  display: flex;
  align-items: center;
}

.identity-block {
  width: 100%;
  gap: 12px;
}

.identity-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.2px;
}

.sub-meta {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.uid-tag {
  font-size: 11px;
  color: #94a3b8;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.card-time {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
}

.state-block {
  gap: 10px;
  flex-shrink: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.status-pill.tone-blue {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-pill.tone-green {
  background: #ecfdf5;
  color: #15803d;
}

.status-pill.tone-red {
  background: #fef2f2;
  color: #b91c1c;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.message-box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 12px 14px;
}

.tone-green .message-box {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
}

.action-row {
  gap: 10px;
  justify-content: flex-end; /* 将按钮靠右对齐 */
}

.action-btn {
  min-height: 38px;
  border-radius: 12px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  border: none;
  color: #ffffff;
}

.btn-primary.tone-blue {
  background: #2563eb;
  box-shadow: 0 6px 14px -8px rgba(37, 99, 235, 0.5);
}

.btn-primary.tone-green {
  background: #16a34a;
  box-shadow: 0 6px 14px -8px rgba(22, 163, 74, 0.45);
}

.btn-primary.tone-red {
  background: #dc2626;
  box-shadow: 0 6px 14px -8px rgba(220, 38, 38, 0.45);
}

.btn-secondary {
  background: #ffffff;
  color: #475569;
  border: 1.5px solid #cbd5e1;
}

.system-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.system-avatar.tone-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #2563eb;
}

.system-avatar.tone-green {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.system-avatar.tone-red {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

@media (max-width: 900px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .state-block {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .notification-card {
    padding: 14px;
  }

  .identity-block {
    align-items: flex-start;
  }

  .action-row {
    flex-wrap: wrap;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
