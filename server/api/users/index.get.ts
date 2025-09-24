// server/api/users/index.get.ts
export default defineEventHandler(async (_event) => {
  try {
    const neon = useNeon()
    const users = await neon.getUsers()

    return {
      status: 'success',
      data: users,
      count: users.length,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '获取用户列表失败',
    })
  }
})
