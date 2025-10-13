// Environment variables validation and configuration
// Bu dosya Vercel deployment'ında environment variables'ların doğru yüklendiğini kontrol eder

interface EnvConfig {
  // Admin authentication
  ADMIN_SECRET_KEY: string

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // App configuration
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_SITE_NAME: string
  NEXT_PUBLIC_SITE_DESCRIPTION: string

  // Optional
  NODE_ENV: string
}

// Environment variables validation
function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'ADMIN_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL'
  ]

  const missingVars: string[] = []
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars)
    console.error('🔧 Please check your Vercel environment variables configuration')
    
    // Development'da warning, production'da error
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
  } else {
    console.log('✅ All required environment variables are loaded')
  }

  return {
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'fallback-secret',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Projesi',
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Modern blog platformu',
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
}

// Export validated environment configuration
export const env = validateEnv()

// Environment check utility
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

// Debug function for Vercel deployment
export function logEnvironmentStatus(): void {
  console.log('🔍 Environment Status:')
  console.log(`- NODE_ENV: ${env.NODE_ENV}`)
  console.log(`- APP_URL: ${env.NEXT_PUBLIC_APP_URL}`)
  console.log(`- Supabase URL: ${env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
  console.log(`- Admin Secret Key: ${env.ADMIN_SECRET_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`- Site Name: ${env.NEXT_PUBLIC_SITE_NAME}`)
}

