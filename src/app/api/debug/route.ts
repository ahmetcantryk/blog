import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // Test Supabase connection
    let connectionTest = null
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('count', { count: 'exact', head: true })
      
      connectionTest = {
        success: !error,
        error: error?.message,
        count: data
      }
    }

    // Test actual data fetch
    let dataTest = null
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .limit(5)
      
      dataTest = {
        success: !error,
        error: error?.message,
        dataCount: data?.length || 0,
        sampleData: data?.[0] || null
      }
    }

    return NextResponse.json({
      environment: envCheck,
      supabaseClient: !!supabase,
      connectionTest,
      dataTest,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
