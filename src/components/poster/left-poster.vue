<!-- 登录注册页面左侧海报 -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backToWebsite = () => {
  router.push({ path: '/' })
}
</script>

<template>
  <div class="left">
    <div class="left-header">
      <span class="logo">Future-PRE</span>
      <button class="back-btn" @click="backToWebsite">
        Back to website <span class="arrow">→</span>
      </button>
    </div>
    <div class="left-footer">
      <div class="slogan">NOT ONLY CHAT,<br />CREATING MEMORIES</div>
    </div>
  </div>
</template>

<style scoped>
.left {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  min-width: 340px;
  /* 背景图填充整个区域 */
  background-image: url('@/statics/authentication/left-poster.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  /* 让内容在背景上显示 */
  color: var(--font-color-main);
}
.left-header {
  padding: 32px 36px 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: var(--font-size-title);
  font-weight: 700;
  color: #fff;
  letter-spacing: var(--font-letter-spacing);
  font-family: var(--font-family);
}
.back-btn {
  background: rgba(139, 92, 246, 0.52);
  color: #ffffff;
  border: none;
  border-radius: 18px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.back-btn .arrow {
  font-size: 1.1em;
  margin-left: 2px;
}
.back-btn:hover {
  background: #8b5cf6;
  color: #fff;
}
.left-img-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 36px;
}
.left-footer {
  padding: 0 36px 32px 36px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.slogan {
  font-size: 1.5rem;
  color: #e0e7ff;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.3;
}
</style>
