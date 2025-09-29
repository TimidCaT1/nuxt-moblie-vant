// composables/useAuth.ts
// 类型定义
interface User {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
  created_at?: string
}

interface LoginCredentials {
  username: string
  password: string
  remember?: boolean
}

interface LoginResponse {
  status: 'success' | 'error'
  message?: string
  token?: string
  user?: User
}

export function useAuth() {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  // 使用 useCookie 替代 localStorage
  const tokenCookie = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: 'lax',
  })

  const token = ref<string | null>(tokenCookie.value)

  console.log('useAuth初始化', {
    isLoggedIn: isLoggedIn.value,
    user: user.value,
    token: token.value,
  })

  // 从token恢复用户信息
  const restoreUser = async () => {
    if (token.value && !user.value) {
      try {
        console.log(`token存在且用户信息为空，尝试恢复用户信息，token: ${token.value}`)

        const { data, error } = await useFetch<LoginResponse>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })

        console.log(`token恢复用户信息响应:`, data.value)

        if (error.value) {
          throw new Error('Token验证失败')
        }

        if (data.value?.status === 'success' && data.value.user) {
          user.value = data.value.user
          console.log('用户信息恢复成功')
        }
        else {
          throw new Error('用户信息获取失败')
        }
      }
      catch (error) {
        // token失效，清除
        console.log(`token失效，清除，error: ${error}`)
        token.value = null
        tokenCookie.value = null
        user.value = null
      }
    }
    else {
      console.log('无需恢复用户信息:', {
        有token: !!token.value,
        有用户: !!user.value,
      })
    }
  }

  // 监听 token 变化，同步到 cookie
  watch(token, (newToken) => {
    console.log('token变化:', newToken)
    tokenCookie.value = newToken
  })

  // 登录
  const login = async (credentials: LoginCredentials) => {
    console.log('开始登录:', credentials.username)

    const { data, error } = await useFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })

    if (error.value) {
      console.error('登录API错误:', error.value)
      throw new Error(error.value.data?.message || '登录失败')
    }

    if (data.value?.status === 'success' && data.value.token) {
      token.value = data.value.token
      user.value = data.value.user || null
      console.log('登录成功:', user.value?.username)
      return data.value
    }
    else {
      console.error('登录失败，响应:', data.value)
      throw new Error(data.value?.message || '登录失败')
    }
  }

  // 登出
  const logout = async () => {
    try {
      if (token.value) {
        console.log('调用登出API')
        await useFetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
      }
    }
    catch (error) {
      // 即使API调用失败也要清除本地状态
      console.log(`登出API调用失败，但仍清除本地状态，error: ${error}`)
    }
    finally {
      console.log('清除本地认证状态')
      token.value = null
      user.value = null
    }
  }

  // 初始化时恢复用户状态
  onMounted(() => {
    console.log('useAuth onMounted，恢复用户状态')
    restoreUser()
  })

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout,
    restoreUser,
  }
}
