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
  const token = useCookie('token')

  // 从token恢复用户信息
  const restoreUser = async () => {
    if (token.value && !user.value) {
      try {
        const { data } = await useFetch<LoginResponse>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        console.log(`token恢复用户信息     data: ${data}`)
        user.value = data.value?.user || null
      }
      catch (error) {
        // token失效，清除
        console.log(`token失效，清除     errorMessage: ${error} `)
        token.value = null
      }
    }
  }

  // 登录
  const login = async (credentials: LoginCredentials) => {
    const { data, error } = await useFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })

    if (error.value) {
      throw new Error(error.value.data?.message || '登录失败')
    }

    token.value = data.value?.token
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
