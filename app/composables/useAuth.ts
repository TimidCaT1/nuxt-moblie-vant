// 类型定义
interface User {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
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
  user?: {
    id: number
    username: string
    email: string
    avatar?: string
    phone?: string
    created_at: string
  }
}
export function useAuth() {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const token = ref<string | null>(import.meta.client ? localStorage.getItem('token') : null)

  console.log('useAuth初始化', { isLoggedIn: isLoggedIn.value, user: user.value, token: token.value })
  // 从token恢复用户信息
  const restoreUser = async () => {
    if (token.value && !user.value) {
      try {
        console.log(`token存在且用户信息为空，尝试恢复用户信息     token: ${token.value} `)
        const { data } = await useFetch<LoginResponse>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        console.log(`token恢复用户信息     data: ${data.value}`)
        user.value = data.value?.user || null
      }
      catch (error) {
        // token失效，清除
        console.log(`token失效，清除     errorMessage: ${error} `)
        token.value = null
      }
    }
  }

  watch(token, (val) => {
    if (!import.meta.client)
      return
    if (val) {
      localStorage.setItem('token', val)
    }
    else {
      localStorage.removeItem('token')
    }
  })

  // 登录
  const login = async (credentials: LoginCredentials) => {
    const { data, error } = await useFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })

    if (error.value) {
      throw new Error(error.value.data?.message || '登录失败')
    }

    token.value = (data.value?.token as string) || null
    user.value = data.value?.user || null

    return data.value
  }

  // 登出
  const logout = async () => {
    try {
      await useFetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    }
    catch (error) {
      // 即使API调用失败也要清除本地状态
      console.log(`即使API调用失败也要清除本地状态     errorMessage: ${error} `)
    }
    finally {
      token.value = null
      user.value = null
    }
  }

  // 初始化时恢复用户状态
  onMounted(() => {
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
