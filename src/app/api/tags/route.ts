import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Blog yazılarından tüm tag'ları çek
    const { data: posts, error } = await supabaseAdmin
      .from('blogs')
      .select('tags')

    if (error) {
      console.error('Error fetching tags:', error)
      return NextResponse.json({ tags: [] }, { status: 200 })
    }

    // Tüm tag'ları birleştir ve sayılarını hesapla
    const tagCounts: { [key: string]: number } = {}
    
    posts?.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    // Tag'ları sayıya göre sırala
    const sortedTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({ tags: sortedTags })
  } catch (error) {
    console.error('Error in tags API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

