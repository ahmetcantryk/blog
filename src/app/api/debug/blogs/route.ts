import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not available' },
        { status: 500 }
      )
    }

    // Get all blog IDs
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch blogs' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blogs: data,
      totalCount: data?.length || 0,
      message: 'Blog list retrieved successfully'
    })
  } catch (error) {
    console.error('Debug blogs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
