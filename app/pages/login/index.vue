<script setup lang="ts">
import { showFailToast, showSuccessToast } from 'vant'
import { ref } from 'vue'

definePageMeta({

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
  try {
    const { error } = await useFetch('/api/login', {
      method: 'POST',
      body: values,
    })

    if (error.value) {
      showFailToast(error.value.data?.message || '登录失败')
      return
    }

    // 登录成功
    showSuccessToast('登录成功')
    // 这里可以存储token，然后跳转到首页
    // 例如：useUserStore().setToken(data.value.token)
    await navigateTo('/')
  }
  catch (err) {
    showFailToast(`登录失败,errMessage: ${err}`)
  }
  finally {
    loading.value = false
  }
}

// 跳转到注册页面
function goToRegister() {
  // 假设注册页面是/register
  navigateTo('/register')
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
  padding: 20px;
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
