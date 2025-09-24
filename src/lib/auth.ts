import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export interface AdminUser {
  username: string
  isAdmin: boolean
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // Debug logging
  console.log('Auth Debug:', {
    providedUsername: username,
    expectedUsername: ADMIN_USERNAME,
    providedPassword: password,
    expectedPassword: ADMIN_PASSWORD,
    envUsername: process.env.ADMIN_USERNAME,
    envPassword: process.env.ADMIN_PASSWORD
  })
  
  if (username !== ADMIN_USERNAME) {
    console.log('Username mismatch')
    return false
  }
  
  // For development, we'll use plain text comparison
  // In production, you should hash the password in .env
  const result = password === ADMIN_PASSWORD
  console.log('Password match result:', result)
  return result
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}
