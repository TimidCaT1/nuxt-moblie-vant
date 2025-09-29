import type { LoginResponse, User } from '~/types/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  // 从 cookie 初始化 token
  const tokenCookie = useCookie('token')
  token.value = tokenCookie.value ? tokenCookie.value : null

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const { data, error } = await useFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })

      if (error.value) {
        throw new Error(error.value.data?.message || '登录失败')
      }

      if (data.value?.status === 'success' && data.value.token) {
        token.value = data.value.token
        user.value = data.value.user || null
        tokenCookie.value = token.value // 更新 cookie

        return data.value
      }
      else {
        throw new Error(data.value?.message || '登录失败')
      }
    }
    catch (error: any) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await useFetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` },
        })
      }
    }
    catch (e) {
      console.warn('退出请求失败:', e)
    }
    finally {
      token.value = null
      user.value = null
      tokenCookie.value = null
    }
  }

  const restoreUser = async () => {
    if (token.value && !user.value) {
      try {
        const { data, error } = await useFetch<LoginResponse>('/api/auth/me', {
          headers: { Authorization: `Bearer ${token.value}` },
        })

        if (error.value) {
          throw new Error('Token验证失败')
        }

        if (data.value?.status === 'success' && data.value.user) {
          user.value = data.value.user
        }
        else {
          throw new Error('用户信息获取失败')
        }
      }
      catch (error) {
        console.error('恢复用户状态失败:', error)
        await logout() // 清除无效的 token
      }
    }
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isLoggedIn,
    login,
    logout,
    restoreUser,
  }
})
