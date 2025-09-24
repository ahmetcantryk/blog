import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, generateToken } from '@/lib/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const user = await verifyAdminCredentials(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    const token = generateToken(user)

    const response = NextResponse.json(
      { 
        success: true, 
        user,
        message: 'Login successful' 
      },
      { status: 200 }
    )

    // Set HTTP-only cookie for additional security
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )

  response.cookies.delete('admin-token')
  return response
}

