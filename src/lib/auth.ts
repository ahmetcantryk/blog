import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.ADMIN_SECRET_KEY || 'fallback-secret'

export interface AdminUser {
  username: string
  isAdmin: boolean
}

// This function is deprecated - use supabase-auth.ts instead
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  console.warn('verifyAdminCredentials is deprecated - use supabase-auth.ts instead')
  return false
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
