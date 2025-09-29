<script setup lang="ts">
import { showSuccessToast } from 'vant'
import { ref } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

definePageMeta({
  layout: 'guest',
  name: 'Login',
})

console.log('登录页面加载状态 (Pinia):', {
  路径: route.path,
  登录状态: authStore.isLoggedIn,
})

// 表单数据
const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)

// 提交登录
async function onSubmit(values: any) {
  loading.value = true
  console.log('提交登录:', values.username)

  try {
    await authStore.login(values.username, values.password)
    console.log('登录成功')
    // 登录成功后，路由守卫会自动处理跳转
    navigateTo('/')
  }
  catch (error: any) {
    console.error('登录失败:', error)
    showSuccessToast(error.message || '登录失败')
  }
  finally {
    loading.value = false
  }
}

// 跳转到注册页面
function goToRegister() {
  // 假设注册页面是/register
  console.log('goToRegister')
  navigateTo('/login/register')
}

// 忘记密码
function forgotPassword() {
  // 跳转到忘记密码页面
  navigateTo('/forgot-password')
}
</script>

<template>
  <div class="login-page">
    <div class="login-header">
      <h1>欢迎回来</h1>
      <p>请登录您的账户</p>
    </div>

    <van-form class="login-form" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.password" type="password" name="password" label="密码" placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登录
        </van-button>
      </div>
    </van-form>

    <div class="login-actions">
      <a href="#" @click.prevent="goToRegister">注册账户</a>
      <a href="#" @click.prevent="forgotPassword">忘记密码</a>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-bottom: 20px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.login-actions a {
  color: #db8645;
  font-size: 14px;
}
</style>
