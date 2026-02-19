<template>
  <div class="loading-wrap" role="status" aria-live="polite">
    <div class="spinner" />
    <div class="text">
      <div class="title">页面加载中</div>
      <div class="desc">请稍候...</div>
    </div>
  </div>
</template>

<script setup>
// 无需脚本
</script>

<style scoped>
.loading-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #909399;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  animation: spin 0.9s linear infinite;
}

.text .title {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
  letter-spacing: 0.3px;
}

.text .desc {
  margin-top: 6px;
  font-size: 13px;
  color: #a8abb2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
