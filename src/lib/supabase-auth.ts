import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export interface AdminUser {
  id: number
  username: string
  email?: string
  isAdmin: boolean
}

// Verify admin credentials against database
export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single()
  
  if (error || !data) {
    console.log('User not found:', username)
    return null
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, data.password_hash)
  if (!isValidPassword) {
    console.log('Invalid password for user:', username)
    return null
  }
  
  // Update last login
  await supabaseAdmin
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id)
  
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    isAdmin: true
  }
}

// Generate JWT token
export function generateToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}

// Verify JWT token
export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

// Get token from request
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}



