import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/supabase-blog-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      )
    }

    // Get the specific blog post
    const post = await getBlogPostBySlug(slug)
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Get all posts for recommendations
    const allPosts = await getAllBlogPosts()
    
    // Get recommended posts (same tags or same author, excluding current post)
    const recommendedPosts = allPosts
      .filter(p => p.id !== post.id)
      .filter(p => 
        p.author === post.author || 
        p.tags.some(tag => post.tags.includes(tag))
      )
      .slice(0, 4) // Limit to 4 recommendations
    
    // If not enough recommendations, fill with latest posts
    if (recommendedPosts.length < 4) {
      const latestPosts = allPosts
        .filter(p => p.id !== post.id && !recommendedPosts.includes(p))
        .slice(0, 4 - recommendedPosts.length)
      recommendedPosts.push(...latestPosts)
    }

    return NextResponse.json({
      success: true,
      post,
      recommendedPosts: recommendedPosts.slice(0, 4)
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}



