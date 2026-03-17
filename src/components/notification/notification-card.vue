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
  cyan: 'tone-cyan',
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
              v-if="notification.status"
              :class="['status-pill', getToneClass(notification.tone)]"
            >
              <span class="status-dot"></span>
              {{ notification.status }}
            </span>
          </div>
        </div>
        <p class="sub-meta">{{ notification.username }}</p>
      </div>
    </div>

    <div class="message-box">
      <p class="message-text">{{ notification.message }}</p>
    </div>

    <div v-if="notification.actions?.length" class="action-row">
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

.notification-card.tone-cyan {
  border-color: #bae6fd;
  background: #f0f9ff;
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

.status-pill.tone-cyan {
  background: #eff6ff;
  color: #0369a1;
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

.btn-primary.tone-cyan {
  background: #0284c7;
  box-shadow: 0 6px 14px -8px rgba(2, 132, 199, 0.45);
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

.system-avatar.tone-blue,
.system-avatar.tone-cyan {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #2563eb;
}

.system-avatar.tone-green {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
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
