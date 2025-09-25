import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPosts, getBlogPostsCount } from '@/lib/supabase-blog-storage'

// Disable caching for real-time updates
export const revalidate = 0

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: number
  tags: string[]
  thumbnail: string
  featured: boolean
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '8', 10)
  const search = searchParams.get('search') || ''
  const tag = searchParams.get('tag') || ''
  const sort = searchParams.get('sort') || 'newest'
  
  try {
    console.log('API Posts Route - Fetching posts with params:', { page, limit, search, tag, sort })
    
    // Get all blog posts for filtering (we'll do server-side filtering)
    const allPosts = await getAllBlogPosts(1, 1000) // Get more posts for filtering
    
    console.log('API Posts Route - All posts fetched:', allPosts.length)
    
    // Apply filters
    let filteredPosts = allPosts
    
    // Tag filter
    if (tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.includes(tag)
      )
    }
    
    // Search filter
    if (search) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    // Sort posts
    switch (sort) {
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
        break
      case 'popular':
        filteredPosts.sort((a, b) => b.readTime - a.readTime) // Using readTime as popularity proxy
        break
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        break
    }
    
    // Pagination
    const totalCount = filteredPosts.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
    
    // Response data
    const response = {
      posts: paginatedPosts,
      totalCount,
      hasMore: endIndex < totalCount
    }
    
    console.log('API Posts Route - Response:', { 
      postsCount: paginatedPosts.length, 
      totalCount, 
      hasMore: response.hasMore 
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
