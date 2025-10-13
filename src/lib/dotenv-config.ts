// Dotenv configuration for Next.js
// Bu dosya development ortamında .env dosyalarını yükler

import { config } from 'dotenv'
import { resolve } from 'path'

// Development ortamında .env dosyalarını yükle
if (process.env.NODE_ENV !== 'production') {
  // .env.local dosyasını yükle (en yüksek öncelik)
  config({ path: resolve(process.env.cwd || process.cwd(), '.env.local') })
  
  // .env dosyasını yükle
  config({ path: resolve(process.env.cwd || process.cwd(), '.env') })
  
  // .env.development dosyasını yükle (development için)
  if (process.env.NODE_ENV === 'development') {
    config({ path: resolve(process.env.cwd || process.cwd(), '.env.development') })
  }
  
  console.log('🔧 Dotenv configuration loaded for development')
} else {
  console.log('🚀 Production environment - using Vercel environment variables')
}

// Environment variables debug (sadece development)
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Environment Variables Status:')
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`- ADMIN_USERNAME: ${process.env.ADMIN_USERNAME ? '✅ Set' : '❌ Missing'}`)
  console.log(`- ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? '✅ Set' : '❌ Missing'}`)
  console.log(`- ADMIN_SECRET_KEY: ${process.env.ADMIN_SECRET_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`- NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing'}`)
}

