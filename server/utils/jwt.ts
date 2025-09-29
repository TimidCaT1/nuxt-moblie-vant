import process from 'node:process'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.SECRET_KEY || 'your-secret-key'

export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}

export function generateJWTToken(payload: { userId: number, username: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '2h', // 过期时间2小时，可按需调整
  })
}

export function verifyJWTToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  }
  catch (error) {
    throw new Error('Token verification failed' + `${error}`)
  }
}
