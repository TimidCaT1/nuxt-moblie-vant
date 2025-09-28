export default defineNuxtRouteMiddleware(async (to, _from) => {
  const auth = useAuth()

  // 等待用户状态恢复完成
  await auth.restoreUser()

  // 公开路由列表 - 这些路由不需要登录
  const publicRoutes = [
    '/login',
    '/login/register',
    '/forgot-password',
    '/reset-password',
    '/about',
  ]

  // 检查当前路由是否为公开路由
  const isPublicRoute = publicRoutes.some(route =>
    to.path.startsWith(route),
  )

  console.log('路由守卫检查:', {
    路径: to.path,
    是否公开: isPublicRoute,
    是否登录: auth.isLoggedIn.value,
  })
  // return navigateTo(`/login`)
  // 情况1: 用户未登录且访问需要认证的页面 → 跳转到登录页
  if (!auth.isLoggedIn.value && !isPublicRoute) {
    console.log('未登录用户访问受保护页面，重定向到登录页')
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // 情况2: 用户已登录且访问登录/注册页 → 跳转到首页
  if (auth.isLoggedIn.value && isPublicRoute) {
    console.log('已登录用户访问公开页面，重定向到首页')
    const redirect = to.query.redirect as string
    return navigateTo(redirect || '/')
  }

  // 其他情况: 允许访问
})
