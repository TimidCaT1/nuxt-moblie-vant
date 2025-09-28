export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供认证令牌',
    })
  }

  try {
    // 验证token（这里需要实现token验证逻辑）
    const userId = verifyToken(token)

    const connection = await createDBConnection()
    const [users] = await connection.execute(
      'SELECT id, username, email, avatar, phone, created_at FROM users WHERE id = ?',
      [userId],
    )

    await connection.end()

    if (!Array.isArray(users) || users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户不存在',
      })
    }

    return {
      user: users[0],
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: `认证失败 ${error}`,
    })
  }
})

// 简单的token验证（实际应该使用JWT）
function verifyToken(token: string): number {
  // 这里应该实现真正的token验证逻辑
  // 现在只是简单解析
  const match = token.match(/token_(\d+)_/)
  if (!match) {
    throw new Error('无效的token')
  }
  return Number.parseInt(match[1])
}
