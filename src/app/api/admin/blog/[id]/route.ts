import { NextRequest, NextResponse } from 'next/server'
import { updateBlogPost, deleteBlogPost, getBlogPostById } from '@/lib/supabase-blog-storage'
import { getTokenFromRequest, verifyToken } from '@/lib/supabase-auth'

// Disable caching for real-time updates
export const revalidate = 0

// Middleware to check admin authentication
function checkAdminAuth(request: NextRequest): NextResponse | null {
  const cookieToken = request.cookies.get('admin-token')?.value
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
  
  return null
}

// Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request)
  if (authError) return authError
  
  try {
    const { id: idParam } = await params
    console.log('Blog edit API - ID param:', idParam)
    
    const id = parseInt(idParam)
    console.log('Blog edit API - Parsed ID:', id)
    
    if (isNaN(id)) {
      console.log('Blog edit API - Invalid ID:', idParam)
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      )
    }
    
    console.log('Blog edit API - Fetching blog post with ID:', id)
    const post = await getBlogPostById(id)
    console.log('Blog edit API - Post found:', !!post)
    
    if (!post) {
      console.log('Blog edit API - Post not found for ID:', id)
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, post },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request)
  if (authError) return authError
  
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    
    // Clean up the data
    const cleanedData = {
      ...(updateData.title && { title: updateData.title.trim() }),
      ...(updateData.excerpt && { excerpt: updateData.excerpt.trim() }),
      ...(updateData.content && { content: updateData.content.trim() }),
      ...(updateData.author && { author: updateData.author.trim() }),
      ...(updateData.publishDate && { publishDate: updateData.publishDate }),
      ...(updateData.readTime !== undefined && { readTime: updateData.readTime }),
      ...(updateData.tags && { tags: updateData.tags }),
      ...(updateData.thumbnail && { thumbnail: updateData.thumbnail }),
      ...(updateData.featured !== undefined && { featured: updateData.featured }),
      // SEO fields
      ...(updateData.metaTitle !== undefined && { metaTitle: updateData.metaTitle }),
      ...(updateData.metaDescription !== undefined && { metaDescription: updateData.metaDescription }),
      ...(updateData.metaKeywords !== undefined && { metaKeywords: updateData.metaKeywords }),
      ...(updateData.canonicalUrl !== undefined && { canonicalUrl: updateData.canonicalUrl }),
      ...(updateData.ogTitle !== undefined && { ogTitle: updateData.ogTitle }),
      ...(updateData.ogDescription !== undefined && { ogDescription: updateData.ogDescription }),
      ...(updateData.ogImage !== undefined && { ogImage: updateData.ogImage }),
      ...(updateData.twitterTitle !== undefined && { twitterTitle: updateData.twitterTitle }),
      ...(updateData.twitterDescription !== undefined && { twitterDescription: updateData.twitterDescription }),
      ...(updateData.twitterImage !== undefined && { twitterImage: updateData.twitterImage })
    }
    
    const updatedPost = await updateBlogPost(id, cleanedData)
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        post: updatedPost,
        message: 'Blog post updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request)
  if (authError) return authError
  
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteBlogPost(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Blog post deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}



