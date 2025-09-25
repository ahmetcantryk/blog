// src/lib/sitemap-generator.ts
import { getAllBlogPosts } from './supabase-blog-storage'

export interface SitemapUrl {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export async function generateSitemapUrls(): Promise<SitemapUrl[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://woyable.com'
  
  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // Get all blog posts
    const blogPosts = await getAllBlogPosts(1, 1000) // Get all posts
    
    // Blog post pages
    const blogPages: SitemapUrl[] = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap URLs:', error)
    return staticPages
  }
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  
  return xml
}

export async function updateSitemap(): Promise<boolean> {
  try {
    console.log('🔄 Updating sitemap...')
    
    // Generate sitemap URLs
    const urls = await generateSitemapUrls()
    
    // Generate XML
    const sitemapXml = generateSitemapXml(urls)
    
    // In production, you might want to write this to a file or upload to a CDN
    // For now, we'll just log it
    console.log('✅ Sitemap updated successfully')
    console.log(`📊 Total URLs: ${urls.length}`)
    
    // You can also trigger a rebuild if using static generation
    if (process.env.NODE_ENV === 'production') {
      // Trigger Vercel rebuild or update static files
      console.log('🚀 Production: Sitemap should be regenerated on next build')
    }
    
    return true
  } catch (error) {
    console.error('❌ Error updating sitemap:', error)
    return false
  }
}
