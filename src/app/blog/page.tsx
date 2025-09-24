import { Suspense } from "react"
import Link from "next/link"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"
import { Breadcrumb } from "@/components/breadcrumb"
import { BlogClient } from "@/components/blog-client"
import { getAllBlogPosts } from "@/lib/supabase-blog-storage"
import { BlogPost } from "@/app/api/posts/route"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Yazıları - Daily Words",
  description: "Teknoloji, yazılım geliştirme ve dijital dönüşüm hakkında güncel blog yazıları. Her gün yeni içeriklerle bilginizi genişletin.",
  keywords: ["blog", "teknoloji", "yazılım geliştirme", "web teknolojileri", "next.js", "react", "typescript", "javascript", "programlama", "tutorial"],
  openGraph: {
    title: "Blog Yazıları - Daily Words",
    description: "Teknoloji, yazılım geliştirme ve dijital dönüşüm hakkında güncel blog yazıları.",
    type: "website",
  },
}

interface Tag {
  name: string
  count: number
}

interface BlogPageData {
  posts: BlogPost[]
  totalCount: number
  hasMore: boolean
}

async function getBlogData(
  page: number = 1,
  limit: number = 12,
  search?: string,
  tag?: string,
  sort: "newest" | "oldest" | "popular" = "newest"
): Promise<BlogPageData> {
  try {
    const allPosts = await getAllBlogPosts()
    
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
        filteredPosts.sort((a, b) => b.readTime - a.readTime)
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
    
    return {
      posts: paginatedPosts,
      totalCount,
      hasMore: endIndex < totalCount
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    return {
      posts: [],
      totalCount: 0,
      hasMore: false
    }
  }
}

async function getTags(): Promise<Tag[]> {
  try {
    const allPosts = await getAllBlogPosts()
    const tagCounts: { [key: string]: number } = {}
    
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1', 10)
  const limit = parseInt(params.limit as string || '12', 10)
  const search = params.search as string || ''
  const tag = params.tag as string || ''
  const sort = (params.sort as "newest" | "oldest" | "popular") || 'newest'

  // Server-side data fetching
  const [blogData, tags] = await Promise.all([
    getBlogData(page, limit, search, tag, sort),
    getTags()
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Header */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-center">
            <Link href="/" className="text-2xl font-bold text-slate-800 dark:text-slate-200 hover:text-primary transition-colors">
              #DailyWords
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "Blog" }]} />
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        }>
          <BlogClient 
            initialData={blogData}
            initialTags={tags}
            initialFilters={{ search, tag, sort, page }}
          />
        </Suspense>
      </div>
    </div>
  )
}