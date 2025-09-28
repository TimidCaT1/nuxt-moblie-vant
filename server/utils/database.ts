// server/utils/database.ts
import { createConnection } from 'mysql2/promise'

// interface DatabaseConfig {
//   host: string
//   port: number
//   database: string
//   user: string
//   password: string
//   waitForConnections: boolean
//   connectionLimit: number
//   queueLimit: number
// }

export async function createDBConnection() {
  const config = useRuntimeConfig()

  const dbConfig = {
    host: config.DATABASE_HOST,
    port: Number(config.DATABASE_PORT) || 3306,
    database: config.DATABASE_NAME,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    charset: 'utf8mb4',
    timezone: '+08:00',
    multipleStatements: false,
  }

  // const dbConfig: DatabaseConfig = {
  //   host: config.DATABASE_HOST,
  //   port: Number(config.DATABASE_PORT),
  //   database: config.DATABASE_NAME,
  //   user: config.DATABASE_USER,
  //   password: config.DATABASE_PASSWORD,
  //   waitForConnections: true,
  //   connectionLimit: 10,
  //   queueLimit: 0,
  // }

  console.log('尝试连接数据库配置:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    // 不打印密码
  })

  try {
    const connection = await createConnection(dbConfig)
    console.log('✅ TDSQL-C 数据库连接成功')
    return connection
  }
  catch (error) {
    console.error('❌ TDSQL-C 数据库连接失败:', error)
    throw error
  }
}
