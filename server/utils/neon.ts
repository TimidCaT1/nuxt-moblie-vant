// server/utils/neon.ts
import { neon } from '@neondatabase/serverless'

// 创建全局数据库连接实例
let sql: any = null

export function useNeon() {
  const config = useRuntimeConfig()

  if (!sql) {
    // 初始化 Neon 连接
    sql = neon(config.databaseUrl)
  }

  return {
    sql,

    // 用户相关操作
    async getUsers() {
      try {
        return await sql`SELECT * FROM users ORDER BY created_at DESC`
      }
      catch (error) {
        console.error('Error fetching users:', error)
        throw error
      }
    },

    async getUserById(id: number) {
      try {
        const result = await sql`SELECT * FROM users WHERE id = ${id}`
        return result[0] || null
      }
      catch (error) {
        console.error('Error fetching user:', error)
        throw error
      }
    },

    async createUser(userData: { name: string, email: string, age?: number }) {
      try {
        const result = await sql`
          INSERT INTO users (name, email, age) 
          VALUES (${userData.name}, ${userData.email}, ${userData.age || null})
          RETURNING *
        `
        return result[0]
      }
      catch (error) {
        console.error('Error creating user:', error)
        throw error
      }
    },

    // 测试连接
    async testConnection() {
      try {
        const result = await sql`SELECT version()`
        return { success: true, version: result[0].version }
      }
      catch (error) {
        return { success: false, error }
      }
    },
  }
};
