"use client"

import { useEffect, useState, useCallback } from "react"
import { BlogPost } from "@/app/api/posts/route"
import { BlogCard } from "@/components/blog-card"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"
import { Button } from "@/components/ui/button"
import { Loader2, Search, X, ArrowRight } from "lucide-react"
import Link from "next/link"

interface HomeBlogTabsProps {
  initialPosts: BlogPost[]
}

function HomeBlogTabs({ initialPosts }: HomeBlogTabsProps) {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>(initialPosts)
  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [recentPage, setRecentPage] = useState(1)
  const [recentLoading, setRecentLoading] = useState(false)
  const [recentHasMore, setRecentHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingMore) return
    
    if (!recentHasMore) return

    setLoadingMore(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const response = await fetch(`/api/posts?page=${recentPage + 1}&limit=8`)
      const data = await response.json()
      
      setRecentPosts(prev => [...prev, ...data.posts])
      setRecentPage(prev => prev + 1)
      setRecentHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [recentPage, recentHasMore, loadingMore])

  // Infinite scroll
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            recentHasMore &&
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500
          ) {
            loadMorePosts()
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePosts, recentHasMore])

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPosts(allPosts)
      return
    }

    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredPosts(filtered)
  }, [allPosts])

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
    if (searchOpen) {
      setSearchQuery("")
      setFilteredPosts(allPosts)
    }
  }


  return (
    <div className="w-full space-y-8">
      {/* Modern Header with Search */}
      <div className="flex flex-col items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          {searchOpen ? (
            <div className="flex items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Blog ara... (başlık, içerik veya etiket)"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-slate-500 dark:placeholder:text-slate-400"
                autoFocus
              />
              <button
                onClick={toggleSearch}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={toggleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-all hover:scale-105 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg"
              >
                <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Ara</span>
              </button>
            </div>
          )}
        </div>

        {/* Blog List */}
        <div className="space-y-6 mt-8">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center text-sm text-muted-foreground mb-6">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                "{searchQuery}" için {filteredPosts.length} sonuç bulundu
              </span>
            </div>
          )}

          {recentLoading ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <BlogCardSkeleton key={`recent-skeleton-${i}`} />
              ))}
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              {(searchQuery ? filteredPosts : recentPosts).map((post) => (
                <BlogCard key={post.id} post={post} layout="vertical" />
              ))}
              
              {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={`recent-more-${i}`} />
              ))}
            </div>
          )}

          {loadingMore && recentHasMore && (
            <div className="flex justify-center pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Daha fazla yükleniyor...</span>
              </div>
            </div>
          )}

          {!recentHasMore && recentPosts.length > 0 && (
            <div className="text-center text-muted-foreground py-6">
              <p className="text-sm mb-4">📚 Tüm son yazılar yüklendi!</p>
              <Link href="/blog">
                <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl">
                  Tüm Blog Yazıları
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { HomeBlogTabs }