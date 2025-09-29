export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
  created_at: string
  last_login?: string
  status: number
}

export interface LoginCredentials {
  username: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  status: 'success' | 'error'
  message?: string
  token?: string
  user?: Omit<User, 'password'> // 排除密码字段
}

export interface RegisterResponse {
  status: 'success' | 'error'
  message?: string
  userId?: number
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message?: string
  data?: T
  timestamp?: string
}
