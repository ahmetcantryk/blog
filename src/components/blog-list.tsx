"use client"

import { useEffect, useState, useCallback } from "react"
import { BlogPost } from "@/app/api/posts/route"
import { BlogCard } from "@/components/blog-card"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"
import { Loader2 } from "lucide-react"

interface BlogListProps {
  initialPosts: BlogPost[]
  initialHasMore: boolean
}

export function BlogList({ initialPosts, initialHasMore }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      // Hızlı loading - 200ms
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const response = await fetch(`/api/posts?page=${page}&limit=12`)
      const data = await response.json()
      
      setPosts(prev => [...prev, ...data.posts])
      setPage(prev => prev + 1)
      setHasMore(data.pagination.hasNextPage)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  // Optimize edilmiş infinite scroll
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500
          ) {
            loadMore()
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
        
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <BlogCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      {loading && hasMore && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Keşfet...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-muted-foreground py-6">
          <p className="text-sm">🎉 Tüm blog yazıları keşfedildi!</p>
        </div>
      )}
    </div>
  )
}
