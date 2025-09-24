interface CreateUserBody {
  name: string
  email: string
  age?: number
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateUserBody>(event)

    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: '姓名和邮箱是必填项',
      })
    }

    const neon = useNeon()
    const user = await neon.createUser(body)

    return {
      status: 'success',
      data: user,
      message: '用户创建成功',
    }
  }
  catch (error: any) {
    const statusCode = error.message.includes('已存在') ? 409 : 500
    throw createError({
      statusCode,
      statusMessage: error.message || '创建用户失败',
    })
  }
})
