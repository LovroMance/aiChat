<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

// 注册api调用
import { useUserRegister } from '@/api/user'
const userRegister = async () => {
        const res = await useUserRegister({
            username: username.value,
            password: password.value
        })
        console.log(res)
        alert('注册成功！')
        router.push('/login')
}

const handleRegister = () => {
    // 这里可以添加注册逻辑
    if (!username.value) {
        alert('请填写正确的用户名')
        return
    }
    if(!password.value){
        alert('请填写密码')
        return
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if(!passwordRegex.test(password.value)){
        alert('密码必须包含数字和字母，长度不低于6位')
        return
    }
    if (password.value !== confirmPassword.value) {
        alert('两次输入的密码不一致')
        return
    }
    userRegister()
}
</script>

<template>
    <div class="register-bg">
        <div class="register-card">
            <h2 class="register-title">注册新账号</h2>
            <div class="register-form">
                <input v-model="username" type="text" placeholder="用户名" class="register-input" />
                <input v-model="password" type="password" placeholder="密码（包含数字、字母，不低于6位）" class="register-input" />
                <input v-model="confirmPassword" type="password" placeholder="确认密码" class="register-input" />
                <button class="register-btn" @click="handleRegister">注册</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-bg {
    min-height: 100vh;
    background: linear-gradient(135deg, #23272e 0%, #3a4047 70%, #6b7b8a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-card {
    background: #23272e;
    border-radius: 20px;
    box-shadow: 0 6px 36px rgba(60, 80, 120, 0.18);
    padding: 48px 40px 36px 40px;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.register-title {
    color: #ececec;
    font-size: 2rem;
    margin-bottom: 32px;
    letter-spacing: 2px;
    font-weight: 600;
}

.register-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.register-input {
    width: 100%;
    padding: 12px 18px;
    border: 1.5px solid #444c56;
    border-radius: 16px;
    background: #3a4047;
    color: #ececec;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
}

.register-input:focus {
    border-color: #6b7b8a;
    background: #444c56;
}

.register-btn {
    width: 100%;
    padding: 12px 0;
    border: none;
    border-radius: 16px;
    background: linear-gradient(90deg, #6b7b8a 60%, #545c64 100%);
    color: #fff;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 8px rgba(107, 123, 138, 0.08);
}

.register-btn:hover {
    background: linear-gradient(90deg, #545c64 60%, #6b7b8a 100%);
    box-shadow: 0 6px 24px rgba(107, 123, 138, 0.18);
}
</style>
