import process from 'node:process'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.SECRET_KEY || 'your-secret-key'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌',
    })
  }

  try {
    const payload = verifyToken(token)

    const connection = await createDBConnection()
    const [users] = await connection.execute(
      'SELECT id, username, email, avatar, phone, created_at FROM users WHERE id = ?',
      [payload.userId],
    )
    await connection.end()

    if (!Array.isArray(users) || users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户不存在',
      })
    }

    return { status: 'success', user: users[0] }
  }
  catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: `认证失败: ${error.message || error}`,
    })
  }
})

// 简单的token验证（实际应该使用JWT）
export function verifyToken(token: string): { userId: number, username: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number, username: string }
  }
  catch (err) {
    throw new Error('无效的token' + `${err}`)
  }
}
