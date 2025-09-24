"use client"

import { useEffect, useState } from "react"
import { BlogPost } from "@/app/api/posts/route"
import { BlogList } from "@/components/blog-list"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"

export function InitialBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        // Hızlı loading - 300ms
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const response = await fetch('/api/posts?page=1&limit=12')
        const data = await response.json()
        
        setPosts(data.posts)
        setHasMore(data.pagination.hasNextPage)
      } catch (error) {
        console.error('Error loading initial posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <BlogCardSkeleton key={`initial-skeleton-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <BlogList 
      initialPosts={posts}
      initialHasMore={hasMore}
    />
  )
}

