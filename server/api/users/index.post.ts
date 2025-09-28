// server/api/users/index.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password } = body

    // 验证必填字段
    if (!name || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: '姓名和邮箱为必填项',
      })
    }

    const connection = await createDBConnection()

    // 检查邮箱是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email],
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await connection.end()
      throw createError({
        statusCode: 409,
        statusMessage: '邮箱已存在',
      })
    }

    // 插入新用户
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, password || null], // 密码可以为空或加密处理
    )

    await connection.end()

    // 返回创建的用户信息（不包含密码）
    return {
      status: 'success',
      message: '用户创建成功',
      data: {
        id: (result as any).insertId,
        name,
        email,
        created_at: new Date(),
      },
    }
  }
  catch (error: any) {
    console.error('创建用户失败:', error)

    // 如果是我们抛出的错误，直接抛出
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `创建用户失败: ${error.message}`,
    })
  }
})
