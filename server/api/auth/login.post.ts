// server/api/auth/login.post.ts
import { generateJWTToken } from '../../utils/jwt'
import { verifyPassword } from '../../utils/password'

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

// 验证用户的辅助函数
async function validateUser(username: string, password: string): Promise<any> {
  const connection = await createDBConnection()

  try {
    console.log('查询用户:', username)

    // 查询用户（支持用户名、邮箱、手机号登录）
    const [users] = await connection.execute(
      `SELECT id, username, email, password_hash, avatar, phone, status, 
              last_login_at, created_at 
       FROM users 
       WHERE username = ? OR email = ? OR phone = ?`,
      [username, username, username],
    )

    console.log('查询结果数量:', Array.isArray(users) ? users.length : 0)

    if (!Array.isArray(users) || users.length === 0) {
      console.log('用户不存在')
      return null
    }

    const user = users[0] as any
    console.log('找到用户:', user.username)

    // 验证密码
    console.log('开始验证密码...')
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    console.log('密码验证结果:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('密码错误')
      return null
    }

    // 检查用户状态
    if (user.status !== 1) {
      throw new Error('账户已被禁用')
    }

    // 返回用户信息（排除密码哈希）
    const { password_hash, ...safeUser } = user
    return safeUser
  }
  catch (error) {
    console.error('验证用户失败:', error)
    throw error
  }
  finally {
    await connection.end()
  }
}

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const body = await readBody(event)
  const { username, password } = body

  console.log('登录请求:', { username })

  // 验证输入
  if (!username || !password) {
    console.log('用户名或密码为空')
    return {
      status: 'error',
      message: '用户名和密码不能为空',
    }
  }

  try {
    // 验证用户名密码
    const user = await validateUser(username, password)

    if (!user) {
      console.log('用户名或密码错误')
      return {
        status: 'error',
        message: '用户名或密码错误',
      }
    }

    console.log('用户验证成功，生成token...')

    // 生成 JWT token
    const token = generateJWTToken({
      userId: user.id,
      username: user.username,
    })

    console.log('Token生成成功，更新最后登录时间...')

    // 更新最后登录时间
    const connection = await createDBConnection()
    await connection.execute(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [user.id],
    )
    await connection.end()

    console.log('登录流程完成')

    return {
      status: 'success',
      message: '登录成功',
      token,
      user,
    }
  }
  catch (error: any) {
    console.error('登录失败:', error)

    if (error.message === '账户已被禁用') {
      return {
        status: 'error',
        message: error.message,
      }
    }

    return {
      status: 'error',
      message: `登录失败: ${error.message}`,
    }
  }
})
