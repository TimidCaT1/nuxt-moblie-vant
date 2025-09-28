import process from 'node:process'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
  userId: number
  username: string
  iat?: number
  exp?: number
}

export function generateJWTToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // token 7天后过期
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
