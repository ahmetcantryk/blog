import fs from 'fs'
import path from 'path'
import { BlogPost } from '@/app/api/posts/route'

const BLOG_DATA_FILE = path.join(process.cwd(), 'src/data/blog-posts.json')

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

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}

// Read all blog posts
export function getAllBlogPosts(): BlogPost[] {
  try {
    const fileContent = fs.readFileSync(BLOG_DATA_FILE, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// Save all blog posts
function saveBlogPosts(posts: BlogPost[]): void {
  try {
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(posts, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving blog posts:', error)
    throw new Error('Failed to save blog posts')
  }
}

// Create new blog post
export function createBlogPost(newPost: NewBlogPost): BlogPost {
  const posts = getAllBlogPosts()
  
  // Generate new ID (highest existing ID + 1)
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0
  const id = maxId + 1
  
  // Generate slug
  const slug = generateSlug(newPost.title)
  
  // Create full blog post
  const blogPost: BlogPost = {
    id,
    slug,
    ...newPost
  }
  
  // Add to beginning of array (newest first)
  posts.unshift(blogPost)
  
  // Save to file
  saveBlogPosts(posts)
  
  return blogPost
}

// Update existing blog post
export function updateBlogPost(id: number, updatedPost: Partial<NewBlogPost>): BlogPost | null {
  const posts = getAllBlogPosts()
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    return null
  }
  
  // Update the post
  posts[postIndex] = {
    ...posts[postIndex],
    ...updatedPost,
    // Regenerate slug if title changed
    ...(updatedPost.title && { slug: generateSlug(updatedPost.title) })
  }
  
  // Save to file
  saveBlogPosts(posts)
  
  return posts[postIndex]
}

// Delete blog post
export function deleteBlogPost(id: number): boolean {
  const posts = getAllBlogPosts()
  const initialLength = posts.length
  const filteredPosts = posts.filter(p => p.id !== id)
  
  if (filteredPosts.length === initialLength) {
    return false // Post not found
  }
  
  // Save to file
  saveBlogPosts(filteredPosts)
  
  return true
}

// Get blog post by ID
export function getBlogPostById(id: number): BlogPost | null {
  const posts = getAllBlogPosts()
  return posts.find(p => p.id === id) || null
}

// Get blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts()
  return posts.find(p => p.slug === slug) || null
}
