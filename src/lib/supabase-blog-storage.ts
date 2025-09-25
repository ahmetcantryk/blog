// src/lib/supabase-blog-storage.ts
import { supabase, supabaseAdmin } from './supabase'
import { updateSitemap } from './sitemap-generator'

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

export interface NewBlogPost {
  title: string
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

// Get all blog posts with pagination support
export async function getAllBlogPosts(page: number = 1, limit: number = 20): Promise<BlogPost[]> {
  if (!supabase) {
    console.warn('Supabase client not available')
    return []
  }
  
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  console.log('Fetching blog posts:', { page, limit, from, to })
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('publish_date', { ascending: false })
    .range(from, to)
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  console.log('Blog posts fetched:', data?.length || 0, 'posts')
  
  return data?.map(mapDbToBlogPost) || []
}

// Get total count for pagination
export async function getBlogPostsCount(): Promise<number> {
  if (!supabase) return 0
  
  const { count, error } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.error('Error fetching blog posts count:', error)
    return 0
  }
  
  return count || 0
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Create blog post with automatic sitemap update
export async function createBlogPost(newPost: NewBlogPost): Promise<BlogPost | null> {
  const slug = generateSlug(newPost.title)
  
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .insert({
      title: newPost.title,
      slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      author: newPost.author,
      publish_date: newPost.publishDate,
      read_time: newPost.readTime,
      tags: newPost.tags,
      thumbnail: newPost.thumbnail,
      featured: newPost.featured,
      meta_title: newPost.metaTitle,
      meta_description: newPost.metaDescription,
      meta_keywords: newPost.metaKeywords,
      canonical_url: newPost.canonicalUrl,
      og_title: newPost.ogTitle,
      og_description: newPost.ogDescription,
      og_image: newPost.ogImage,
      twitter_title: newPost.twitterTitle,
      twitter_description: newPost.twitterDescription,
      twitter_image: newPost.twitterImage
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating blog post:', error)
    return null
  }
  
  const blogPost = mapDbToBlogPost(data)
  
  // Automatically update sitemap after creating blog post
  try {
    await updateSitemap()
    console.log('✅ Sitemap updated after creating blog post')
  } catch (sitemapError) {
    console.error('❌ Error updating sitemap after blog creation:', sitemapError)
    // Don't fail the blog creation if sitemap update fails
  }
  
  return blogPost
}

// Update blog post with automatic sitemap update
export async function updateBlogPost(id: number, updatedPost: Partial<NewBlogPost>): Promise<BlogPost | null> {
  const updateData: any = {}
  
  if (updatedPost.title) {
    updateData.title = updatedPost.title
    updateData.slug = generateSlug(updatedPost.title)
  }
  if (updatedPost.excerpt) updateData.excerpt = updatedPost.excerpt
  if (updatedPost.content) updateData.content = updatedPost.content
  if (updatedPost.author) updateData.author = updatedPost.author
  if (updatedPost.publishDate) updateData.publish_date = updatedPost.publishDate
  if (updatedPost.readTime !== undefined) updateData.read_time = updatedPost.readTime
  if (updatedPost.tags) updateData.tags = updatedPost.tags
  if (updatedPost.thumbnail) updateData.thumbnail = updatedPost.thumbnail
  if (updatedPost.featured !== undefined) updateData.featured = updatedPost.featured
  
  // SEO fields
  if (updatedPost.metaTitle !== undefined) updateData.meta_title = updatedPost.metaTitle
  if (updatedPost.metaDescription !== undefined) updateData.meta_description = updatedPost.metaDescription
  if (updatedPost.metaKeywords !== undefined) updateData.meta_keywords = updatedPost.metaKeywords
  if (updatedPost.canonicalUrl !== undefined) updateData.canonical_url = updatedPost.canonicalUrl
  if (updatedPost.ogTitle !== undefined) updateData.og_title = updatedPost.ogTitle
  if (updatedPost.ogDescription !== undefined) updateData.og_description = updatedPost.ogDescription
  if (updatedPost.ogImage !== undefined) updateData.og_image = updatedPost.ogImage
  if (updatedPost.twitterTitle !== undefined) updateData.twitter_title = updatedPost.twitterTitle
  if (updatedPost.twitterDescription !== undefined) updateData.twitter_description = updatedPost.twitterDescription
  if (updatedPost.twitterImage !== undefined) updateData.twitter_image = updatedPost.twitterImage
  
  updateData.updated_at = new Date().toISOString()
  
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating blog post:', error)
    return null
  }
  
  const blogPost = mapDbToBlogPost(data)
  
  // Automatically update sitemap after updating blog post
  try {
    await updateSitemap()
    console.log('✅ Sitemap updated after updating blog post')
  } catch (sitemapError) {
    console.error('❌ Error updating sitemap after blog update:', sitemapError)
    // Don't fail the blog update if sitemap update fails
  }
  
  return blogPost
}

// Delete blog post with automatic sitemap update
export async function deleteBlogPost(id: number): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
  
  // Automatically update sitemap after deleting blog post
  try {
    await updateSitemap()
    console.log('✅ Sitemap updated after deleting blog post')
  } catch (sitemapError) {
    console.error('❌ Error updating sitemap after blog deletion:', sitemapError)
    // Don't fail the blog deletion if sitemap update fails
  }
  
  return true
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Helper function to map database row to BlogPost
function mapDbToBlogPost(dbRow: any): BlogPost {
  return {
    id: dbRow.id,
    title: dbRow.title,
    slug: dbRow.slug,
    excerpt: dbRow.excerpt,
    content: dbRow.content,
    author: dbRow.author,
    publishDate: dbRow.publish_date,
    readTime: dbRow.read_time,
    tags: dbRow.tags || [],
    thumbnail: dbRow.thumbnail,
    featured: dbRow.featured,
    metaTitle: dbRow.meta_title,
    metaDescription: dbRow.meta_description,
    metaKeywords: dbRow.meta_keywords,
    canonicalUrl: dbRow.canonical_url,
    ogTitle: dbRow.og_title,
    ogDescription: dbRow.og_description,
    ogImage: dbRow.og_image,
    twitterTitle: dbRow.twitter_title,
    twitterDescription: dbRow.twitter_description,
    twitterImage: dbRow.twitter_image
  }
}

// Generate slug from title
function generateSlug(title: string): string {
  // Türkçe karakterleri İngilizce karşılıklarına çevir
  const turkishCharMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  }
  
  let slug = title
  
  // Türkçe karakterleri değiştir
  Object.keys(turkishCharMap).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), turkishCharMap[char])
  })
  
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire bırak
    .trim()
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
    .replace(/^-+|-+$/g, '') // Başta ve sonda tire varsa kaldır
}
