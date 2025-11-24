<template>
  <div class="login-container">
    <div class="login-card anime-element">
      <div class="login-header">
        <h2>登录 Z-Learning</h2>
        <p>访问您的学习工具</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            required
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="safe-password"
            placeholder="请输入密码"
            required
            class="form-input"
          >
        </div>

        <button class="macos-button login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="register-link">
          还没有账户？
          <span class="link" @click="showRegister = true">立即注册</span>
        </div>
      </form>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
      <div class="register-modal anime-element" @click.stop>
        <div class="modal-header">
          <h3>注册新账户</h3>
          <button class="close-btn" @click="showRegister = false">
            ×
          </button>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="reg-username">用户名</label>
            <input
              id="reg-username"
              v-model="registerForm.username"
              type="text"
              placeholder="设置用户名"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label for="reg-password">密码</label>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="safe-password"
              placeholder="设置密码（至少6位）"
              required
              minlength="6"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label for="reg-confirm">确认密码</label>
            <input
              id="reg-confirm"
              v-model="registerForm.confirmPassword"
              type="safe-password"
              placeholder="再次输入密码"
              required
              class="form-input"
            >
          </div>

          <button class="macos-button register-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface LoginForm {
  username: string
  password: string
}

interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
}

const router = useRouter()

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
})

const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const showRegister = ref(false)

async function handleLogin() {
  if (!loginForm.username || !loginForm.password) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    // 模拟登录API调用
    const response = await fakeLogin(loginForm.username, loginForm.password)

    if (response.success) {
      localStorage.setItem('accessToken', response.token)
      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify({
        username: loginForm.username,
        loginTime: new Date().toISOString(),
      }))

      // 跳转到首页
      router.push('/pages/today/index')
    }
    else {
      alert(`登录失败：${response.message}`)
    }
  }
  catch (error) {
    console.error('登录错误:', error)
    alert('登录失败，请重试')
  }
  finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
    alert('请填写完整信息')
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  if (registerForm.password.length < 6) {
    alert('密码长度至少6位')
    return
  }

  loading.value = true

  try {
    // 模拟注册API调用
    const response = await fakeRegister(registerForm.username, registerForm.password)

    if (response.success) {
      alert('注册成功，请登录')
      showRegister.value = false
      // 清空注册表单
      Object.assign(registerForm, {
        username: '',
        password: '',
        confirmPassword: '',
      })
    }
    else {
      alert(`注册失败：${response.message}`)
    }
  }
  catch (error) {
    console.error('注册错误:', error)
    alert('注册失败，请重试')
  }
  finally {
    loading.value = false
  }
}

// 模拟API函数
function fakeLogin(username: string, password: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'demo' && password === '123456') {
        resolve({
          success: true,
          token: `fake-jwt-token-${Date.now()}`,
          user: { username, id: 1 },
        })
      }
      else {
        resolve({
          success: false,
          message: '用户名或密码错误',
        })
      }
    }, 1000)
  })
}

function fakeRegister(username: string, password: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username.length < 3) {
        resolve({
          success: false,
          message: '用户名至少3个字符',
        })
      }
      else if (username === 'demo') {
        resolve({
          success: false,
          message: '用户名已存在',
        })
      }
      else {
        resolve({
          success: true,
          message: '注册成功',
        })
      }
    }, 1000)
  })
}
</script>

<style scoped>
@import '../theme/macos.css';

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: var(--macos-radius-large);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--macos-shadow-heavy);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
}

.login-header p {
  margin: 0;
  color: var(--macos-dark-gray);
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--macos-green);
  box-shadow: 0 0 0 3px rgba(40, 202, 66, 0.1);
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--macos-dark-gray);
}

.link {
  color: var(--macos-green);
  cursor: pointer;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.register-modal {
  background: white;
  border-radius: var(--macos-radius-large);
  padding: 30px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--macos-dark-gray);
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: var(--macos-gray);
}

.register-btn {
  width: 100%;
  margin-top: 10px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .register-modal {
    padding: 20px;
    margin: 20px;
  }
}
</style>
