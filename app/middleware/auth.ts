export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  console.log('中间件开始: 恢复用户状态前', { isLoggedIn: auth.isLoggedIn, user: auth.user })
  // await auth.restoreUser()
  console.log('中间件开始: 恢复用户状态后', { isLoggedIn: auth.isLoggedIn, user: auth.user })
})
