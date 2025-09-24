"use client"

import { useEffect, useState, useCallback } from "react"
import { BlogPost } from "@/app/api/posts/route"
import { BlogCard } from "@/components/blog-card"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Clock, Sparkles, TrendingUp, Search, X, ArrowRight } from "lucide-react"
import Link from "next/link"

interface HomeBlogTabsProps {
  initialPosts: BlogPost[]
}

function HomeBlogTabs({ initialPosts }: HomeBlogTabsProps) {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>(initialPosts)
  const [discoverPosts, setDiscoverPosts] = useState<BlogPost[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [recentPage, setRecentPage] = useState(1)
  const [discoverPage, setDiscoverPage] = useState(1)
  const [recentLoading, setRecentLoading] = useState(false)
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [recentHasMore, setRecentHasMore] = useState(true)
  const [discoverHasMore, setDiscoverHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState("recent")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load discover posts when tab is clicked
  const loadDiscoverPosts = useCallback(async () => {
    if (discoverPosts.length > 0) return // Already loaded
    
    setDiscoverLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Simulate personalized content - mix featured and random posts
      const response = await fetch('/api/posts?page=1&limit=8')
      const data = await response.json()
      
      // Simulate personalization by shuffling and prioritizing featured
      const shuffled = [...data.posts]
        .sort(() => Math.random() - 0.5)
        .sort((a, b) => b.featured ? 1 : -1)
      
        setDiscoverPosts(shuffled)
        setDiscoverHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Error loading discover posts:', error)
    } finally {
      setDiscoverLoading(false)
    }
  }, [discoverPosts.length])

  // Load more posts for current tab
  const loadMorePosts = useCallback(async () => {
    if (loadingMore) return
    
    // hasMore kontrolü - son scroll'da tekrar yüklenmeyi engelle
    const currentHasMore = activeTab === "recent" ? recentHasMore : discoverHasMore
    if (!currentHasMore) return

    setLoadingMore(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      if (activeTab === "recent" && recentHasMore) {
        const response = await fetch(`/api/posts?page=${recentPage + 1}&limit=8`)
        const data = await response.json()
        
        setRecentPosts(prev => [...prev, ...data.posts])
        setRecentPage(prev => prev + 1)
        setRecentHasMore(data.hasMore || false)
      } else if (activeTab === "discover" && discoverHasMore) {
        const response = await fetch(`/api/posts?page=${discoverPage + 1}&limit=8`)
        const data = await response.json()
        
        // Simulate personalization for additional content
        const shuffled = [...data.posts].sort(() => Math.random() - 0.5)
        
        setDiscoverPosts(prev => [...prev, ...shuffled])
        setDiscoverPage(prev => prev + 1)
        setDiscoverHasMore(data.hasMore || false)
      }
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [activeTab, recentPage, discoverPage, recentHasMore, discoverHasMore, loadingMore])

  // Infinite scroll
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // hasMore kontrolü ekle - son scroll'da tekrar yüklenmeyi engelle
          const currentHasMore = activeTab === "recent" ? recentHasMore : discoverHasMore
          
          if (
            currentHasMore &&
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
  }, [loadMorePosts, activeTab, recentHasMore, discoverHasMore])

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
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-2xl border-2 border-primary/20">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Blog ara... (başlık, içerik veya etiket)"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <button
                onClick={toggleSearch}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={toggleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-muted/50 hover:bg-muted/80 rounded-2xl transition-all hover:scale-105"
              >
                <Search className="h-5 w-5" />
                <span className="text-sm font-medium">Blog Ara</span>
              </button>
            </div>
          )}
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-sm grid-cols-2 h-12 p-1 bg-muted/50 rounded-2xl">
              <TabsTrigger 
                value="recent" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4" />
                <span className="font-medium">Son Yazılar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="discover" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                onClick={loadDiscoverPosts}
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Keşfet</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recent" className="space-y-6 mt-8">
            {/* Search Results Info */}
            {searchQuery && (
              <div className="text-center text-sm text-muted-foreground mb-6">
                <span className="bg-muted/50 px-3 py-1 rounded-full">
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
              <Button variant="outline" className="gap-2">
                Tüm Blog Yazıları
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-6 mt-8">
        {discoverLoading ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5 animate-bounce" />
                <span>Sizin için kişiselleştiriliyor...</span>
              </div>
            </div>
            <div className="space-y-6 max-w-2xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <BlogCardSkeleton key={`discover-skeleton-${i}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm">Size özel seçilmiş içerikler</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                İlgi alanlarınıza ve okuma geçmişinize göre önerilen blog yazıları
              </p>
            </div>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              {discoverPosts.map((post) => (
                <BlogCard key={post.id} post={post} layout="vertical" />
              ))}
              
              {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={`discover-more-${i}`} />
              ))}
            </div>
          </div>
        )}

        {loadingMore && discoverHasMore && (
          <div className="flex justify-center pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Daha fazla keşfediliyor...</span>
            </div>
          </div>
        )}

        {!discoverHasMore && discoverPosts.length > 0 && (
          <div className="text-center text-muted-foreground py-6">
            <p className="text-sm mb-4">✨ Tüm öneriler keşfedildi!</p>
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                Tüm Blog Yazıları
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export { HomeBlogTabs }