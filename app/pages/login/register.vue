<!-- pages/register.vue -->
<script setup lang="ts">
definePageMeta({
  // 公开页面
})

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)

function emailValidator(val: string) {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return emailRegex.test(val) || '请输入有效的邮箱地址'
}

function passwordValidator(val: string) {
  return val.length >= 6 || '密码长度至少6位'
}

function confirmPasswordValidator(val: string) {
  return val === form.password || '两次输入的密码不一致'
}

async function onSubmit(values: any) {
  loading.value = true

  try {
    const { error } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: values,
    })

    if (error.value) {
      showFailToast(error.value.data?.message || '注册失败')
      return
    }

    showSuccessToast('注册成功')
    await navigateTo('/login')
  }
  catch (err) {
    showFailToast(`注册失败，请稍后重试 errorMessage: ${err}`)
  }
  finally {
    loading.value = false
  }
}

function onLogin() {
  navigateTo('/login')
}

// 图标组件
function UserIcon() {
  return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
    h('path', { 'd': 'M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21', 'stroke': 'currentColor', 'stroke-width': 2 }),
    h('circle', { 'cx': 12, 'cy': 7, 'r': 4, 'stroke': 'currentColor', 'stroke-width': 2 }),
  ])
}

function EmailIcon() {
  return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
    h('rect', { 'x': 2, 'y': 4, 'width': 20, 'height': 16, 'rx': 2, 'stroke': 'currentColor', 'stroke-width': 2 }),
    h('path', { 'd': 'M2 7L12 13L22 7', 'stroke': 'currentColor', 'stroke-width': 2 }),
  ])
}

function LockIcon() {
  return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
    h('rect', { 'x': 3, 'y': 11, 'width': 18, 'height': 11, 'rx': 2, 'stroke': 'currentColor', 'stroke-width': 2 }),
    h('path', { 'd': 'M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11', 'stroke': 'currentColor', 'stroke-width': 2 }),
  ])
}
</script>

<template>
  <div class="register-container">
    <!-- 背景装饰（与登录页相同） -->
    <div class="background-decor">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
      <div class="circle circle-3" />
    </div>

    <div class="register-content">
      <div class="register-header">
        <h1 class="welcome-text">
          创建账户
        </h1>
        <p class="subtitle">
          注册新账户开始使用
        </p>
      </div>

      <div class="form-container">
        <van-form class="register-form" @submit="onSubmit">
          <div class="input-group">
            <van-field
              v-model="form.username" name="username" placeholder="请输入用户名"
              :rules="[{ required: true, message: '请输入用户名' }]" class="custom-field"
            >
              <template #left-icon>
                <div class="input-icon">
                  <UserIcon />
                </div>
              </template>
            </van-field>
          </div>

          <div class="input-group">
            <van-field
              v-model="form.email" name="email" placeholder="请输入邮箱"
              :rules="[{ required: true, message: '请输入邮箱' }, { validator: emailValidator }]"
              class="custom-field"
            >
              <template #left-icon>
                <div class="input-icon">
                  <EmailIcon />
                </div>
              </template>
            </van-field>
          </div>

          <div class="input-group">
            <van-field
              v-model="form.password" type="password" name="password" placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }, { validator: passwordValidator }]"
              class="custom-field"
            >
              <template #left-icon>
                <div class="input-icon">
                  <LockIcon />
                </div>
              </template>
            </van-field>
          </div>

          <div class="input-group">
            <van-field
              v-model="form.confirmPassword" type="password" name="confirmPassword"
              placeholder="请确认密码"
              :rules="[{ required: true, message: '请确认密码' }, { validator: confirmPasswordValidator }]"
              class="custom-field"
            >
              <template #left-icon>
                <div class="input-icon">
                  <LockIcon />
                </div>
              </template>
            </van-field>
          </div>

          <div class="submit-button">
            <van-button
              round block type="primary" native-type="submit" class="register-btn"
              :loading="loading"
            >
              {{ loading ? '注册中...' : '注册' }}
            </van-button>
          </div>
        </van-form>
      </div>

      <div class="login-tip">
        已有账户?
        <span class="login-link" @click="onLogin">立即登录</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
