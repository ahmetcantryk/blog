import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost, getAllBlogPosts } from '@/lib/supabase-blog-storage'
import { getTokenFromRequest, verifyToken } from '@/lib/supabase-auth'

// Middleware to check admin authentication
function checkAdminAuth(request: NextRequest): NextResponse | null {
  // Check cookie first
  const cookieToken = request.cookies.get('admin-token')?.value
  
  // Check Authorization header as backup
  const headerToken = getTokenFromRequest(request)
  
  const token = cookieToken || headerToken
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  const user = verifyToken(token)
  if (!user || !user.isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }
  
  return null // No error, continue
}

// Create new blog post
export async function POST(request: NextRequest) {
  // Check authentication
  const authError = checkAdminAuth(request)
  if (authError) return authError
  
  try {
    const blogData = await request.json()
    
    // Validate required fields
    const { title, excerpt, content, author } = blogData
    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, excerpt, content, author' },
        { status: 400 }
      )
    }
    
    // Set defaults for optional fields
    const newBlogPost = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      publishDate: blogData.publishDate || new Date().toISOString().split('T')[0],
      readTime: blogData.readTime || 5,
      tags: blogData.tags || [],
      thumbnail: blogData.thumbnail || `https://images.unsplash.com/photo-${Date.now()}?w=400&h=250&fit=crop`,
      featured: blogData.featured || false
    }
    
    // Create the blog post
    const createdPost = await createBlogPost(newBlogPost)
    
    return NextResponse.json(
      { 
        success: true, 
        post: createdPost,
        message: 'Blog post created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

// Get all blog posts (admin view)
export async function GET(request: NextRequest) {
  // Check authentication
  const authError = checkAdminAuth(request)
  if (authError) return authError
  
  try {
    const posts = await getAllBlogPosts()
    
    return NextResponse.json(
      { 
        success: true, 
        posts,
        total: posts.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}


