<script setup>
import LeftPoster from '@/components/poster/left-poster.vue'
import '@/assets/common.css'
import '@/assets/root/variable.css'
import useRegisterService from '@/service/authenticationService/register'
import { ref } from 'vue'

const { registerForm, handleRegister, goLogin } = useRegisterService()
const showPassword = ref(false)
const agree = ref(false)
</script>

<template>
  <div class="register-bg">
    <div class="register-main">
      <!-- 左侧海报 -->
      <LeftPoster />
      <!-- 右侧表单 -->
      <div class="register-right">
        <div class="form-card">
          <h2 class="form-title">Create an account</h2>
          <div class="form-link-row">
            <span>Already have an account?</span>
            <button class="login-link" @click="goLogin">Log in</button>
          </div>
          <input
            v-model="registerForm.username"
            type="text"
            placeholder="用户名"
            class="form-input form-group"
          />
          <input
            v-model="registerForm.account"
            type="text"
            placeholder="账号"
            class="form-input form-group"
          />
          <input
            v-model="registerForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="密码"
            class="form-input form-group"
          />
          <div class="form-group">
            <input
              v-model="registerForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="确认密码"
              class="form-input"
            />
            <span class="eye-icon" @click="showPassword = !showPassword"> ⭐ </span>
          </div>
          <div class="form-agree-row">
            <label class="agree-label">
              <input type="checkbox" v-model="agree" />
              <span>I agree to the </span>
              <a href="#" class="terms-link">Terms &amp; Conditions</a>
            </label>
          </div>
          <button class="form-btn" @click="handleRegister">Create account</button>
          <div class="divider"><span>Or register with</span></div>
          <div class="third-login-row">
            <button class="third-btn google-btn">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M44.5 20H24v8.5h11.7C34.9 32.9 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.2-6.2C34.5 6.7 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c9.9 0 18.1-7.1 19.7-16.3H24v-8.5h20.5z"
                  />
                </g>
              </svg>
              Google
            </button>
            <button class="third-btn apple-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.03 0-.06 0-.09-.01-.03-.01-.06-.01-.09-.01-.03 0-.06 0-.09.01-.03.01-.06.01-.09.01-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm-2.07 3.62c-2.13 0-4.09 1.23-5.17 3.13-.47.81-.74 1.74-.74 2.73 0 2.13 1.23 4.09 3.13 5.17.81.47 1.74.74 2.73.74 2.13 0 4.09-1.23 5.17-3.13.47-.81.74-1.74.74-2.73 0-2.13-1.23-4.09-3.13-5.17-.81-.47-1.74-.74-2.73-.74zm-2.07 8.28c-.47.81-.74 1.74-.74 2.73 0 2.13 1.23 4.09 3.13 5.17.81.47 1.74.74 2.73.74 2.13 0 4.09-1.23 5.17-3.13.47-.81.74-1.74.74-2.73 0-2.13-1.23-4.09-3.13-5.17-.81-.47-1.74-.74-2.73-.74-2.13 0-4.09 1.23-5.17 3.13z"
                />
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-bg {
  height: 100vh;
  width: 100vw;
  padding: 32px;
  background: linear-gradient(
    120deg,
    var(--bg-color-tertiary) 0%,
    var(--bg-color-secondary) 40%,
    var(--accent-color) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', 'PingFang SC', 'Arial', sans-serif;
}
.register-main {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  padding: 32px;
  border-radius: 18px;
  background: rgba(60, 56, 90, 0.35);
  box-shadow: 0 2px 24px 0 #161a2144;
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 表单卡片更简洁的玻璃态 */
.form-card {
  width: 550px;
  height: 720px;
  background: rgba(18, 20, 28, 0.45);
  border-radius: 18px;
  padding: 36px 42px;
  backdrop-filter: blur(12px) saturate(140%);
  display: flex;
  flex-direction: column;
  border: 1.5px solid #8b5cf644;
}
/* 标题 */
.form-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: #fff;
  margin-bottom: 18px;
  letter-spacing: 0.3px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
/* 辅助文案更轻 */
.form-link-row {
  width: 100%;
  display: flex;
  font-size: 0.95rem;
  color: #c7d2fe;
  margin-bottom: 42px;
  gap: 8px;
}
.login-link {
  background: none;
  border: none;
  color: #946af5;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  transition: color 0.2s;
}
.login-link:hover {
  color: #fff;
}
.form-group {
  width: 100%;
  margin-bottom: 18px;
  position: relative;
}
.form-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 1.08rem;
  font-family: inherit;
  font-weight: 500;
  outline: none;
  transition:
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
  box-shadow: none;
  letter-spacing: 0.04em;
}
.form-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
.eye-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.eye-icon:hover {
  opacity: 1;
}
.form-agree-row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 34px;
}
.agree-label {
  display: flex;
  align-items: center;
  font-size: 0.94rem;
  color: #c7d2fe;
  user-select: none;
  gap: 6px;
}
.agree-label input {
  accent-color: #8b5cf6;
  margin-right: 4px;
  width: 16px;
  height: 16px;
}
.terms-link {
  color: #8b5cf6;
  text-decoration: underline;
  margin-left: 4px;
  font-weight: 500;
  font-size: 0.98rem;
  cursor: pointer;
  transition: color 0.2s;
}
.terms-link:hover {
  color: #fff;
}
.form-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
  background: #6366f1 100%;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 18px;
  transition: all 0.2s;
}
.form-btn:hover {
  background: #8b5cf6;
}
.divider {
  width: 100%;
  text-align: center;
  color: #c7d2fe;
  font-size: 1rem;
  margin: 14px 0 22px 0;
  position: relative;
}
.divider:before,
.divider:after {
  content: '';
  display: inline-block;
  width: 34%;
  height: 1px;
  background: #bfc8e2;
  opacity: 0.18;
  vertical-align: middle;
  margin: 0 8px;
}
.third-login-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
}
.third-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: none;
}
.third-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.16);
}
.google-btn {
  background: #ffffff;
  color: #2563eb;
  border: 1px solid #e5e7eb;
}
.google-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}
.apple-btn {
  background: #111827;
  color: #ffffff;
  border: 1px solid #1f2937;
}
.apple-btn:hover {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #293245;
}
@media (max-width: 900px) {
  .register-main {
    flex-direction: column;
    padding: 24px 0;
    min-height: 100vh;
    border-radius: 0;
  }
  .register-left,
  .register-right {
    border-radius: 0;
    min-width: 0;
    width: 100vw;
    box-shadow: none;
  }
  .left-img-box {
    padding: 0 12vw;
  }
  .form-card {
    width: 98vw;
    padding: 28px 20px 18px 20px;
    border-radius: 16px;
  }
  .form-title {
    font-size: 1.6rem;
    margin-bottom: 10px;
  }
}
</style>
