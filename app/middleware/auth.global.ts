// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, _from) => {
  const auth = useAuth()
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.includes(to.path)

  // 如果用户未登录且访问的是需要认证的页面，重定向到登录页
  if (!auth.isLoggedIn && !isPublicRoute) {
    return navigateTo('/login')
  }

  // 如果用户已登录且访问的是公开页面（如登录页），重定向到首页
  if (auth.isLoggedIn && isPublicRoute) {
    return navigateTo('/')
  }
})
