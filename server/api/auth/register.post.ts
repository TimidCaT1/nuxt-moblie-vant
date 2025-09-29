import type { RegisterResponse } from '~/types/api'
// server/api/auth/register.post.ts
import { hashPassword } from '../../utils/password'

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  const body = await readBody(event)
  const { username, email, password, confirmPassword } = body

  // 验证输入
  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写完整信息',
    })
  }

  if (password !== confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: '两次输入的密码不一致',
    })
  }

  // 验证密码强度
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: '密码长度至少6位',
    })
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: '邮箱格式不正确',
    })
  }

  try {
    const connection = await createDBConnection()

    // 检查用户名是否已存在
    const [existingUsernames] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      [username],
    )

    if (Array.isArray(existingUsernames) && existingUsernames.length > 0) {
      await connection.end()
      throw createError({
        statusCode: 409,
        statusMessage: '用户名已存在',
      })
    }

    // 检查邮箱是否已存在
    const [existingEmails] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email],
    )

    if (Array.isArray(existingEmails) && existingEmails.length > 0) {
      await connection.end()
      throw createError({
        statusCode: 409,
        statusMessage: '邮箱已存在',
      })
    }

    // 加密密码
    const passwordHash = await hashPassword(password)

    // 创建用户
    const [result] = await connection.execute(
      `INSERT INTO users 
       (username, email, password_hash, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [username, email, passwordHash],
    )

    await connection.end()

    return {
      status: 'success',
      message: '注册成功',
      userId: (result as any).insertId,
    }
  }
  catch (error: any) {
    console.error('注册失败:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `注册失败: ${error.message}`,
    })
  }
})
