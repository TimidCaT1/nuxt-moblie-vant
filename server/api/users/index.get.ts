export default defineEventHandler(async (_event) => {
  try {
    const connection = await createDBConnection()

    // 示例查询
    const [users] = await connection.execute(`
      SELECT id, username, email 
      FROM users 
      LIMIT 10
    `)

    await connection.end()

    return {
      status: 'success',
      data: users,
      count: Array.isArray(users) ? users.length : 0,
    }
  }
  catch (error: any) {
    console.error('用户查询失败:', error)

    throw createError({
      statusCode: 500,
      statusMessage: `数据库查询失败: ${error.message}`,
    })
  }
})
