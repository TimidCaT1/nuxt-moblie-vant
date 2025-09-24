export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const dbUrl = config.databaseUrl // 安全，前端看不到
  return { dbUrl } // 不要直接返回！这里只是举例
})
