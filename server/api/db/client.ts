import process from 'node:process'
import mysql from 'mysql2/promise'

// 通过环境变量管理配置
const pool = mysql.createPool({
  host: process.env.DB_HOST, // TDSQL-C 提供的连接地址
  user: process.env.DB_USER, // 数据库用户名
  password: process.env.DB_PASS, // 数据库密码
  database: process.env.DB_NAME, // 数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
