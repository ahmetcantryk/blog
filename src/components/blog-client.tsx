"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  SortAsc, 
  SortDesc,
  X,
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react"
import { BlogPost } from "@/app/api/posts/route"

interface Tag {
  name: string
  count: number
}

interface BlogPageData {
  posts: BlogPost[]
  totalCount: number
  hasMore: boolean
}

interface BlogClientProps {
  initialData: BlogPageData
  initialTags: Tag[]
  initialFilters: {
    search: string
    tag: string
    sort: string
    page: number
  }
}

export function BlogClient({ initialData, initialTags, initialFilters }: BlogClientProps) {
  const [data, setData] = useState<BlogPageData>(initialData)
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState(initialFilters.search)
  const [selectedTag, setSelectedTag] = useState<string>(initialFilters.tag)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(initialFilters.sort as any)
  const [page, setPage] = useState(initialFilters.page)
  
  const searchParams = useSearchParams()
  const router = useRouter()

  // Blog yazılarını yükle
  const fetchPosts = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (pageNum === 1) setLoadingMore(false)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag && { tag: selectedTag }),
        ...(sortBy && { sort: sortBy }),
      })

      const response = await fetch(`/api/posts?${params}`)
      const result = await response.json()

      if (response.ok) {
        if (reset || pageNum === 1) {
          setData(result)
        } else {
          setData(prev => prev ? {
            ...result,
            posts: [...prev.posts, ...result.posts]
          } : result)
        }
        setPage(pageNum)
      } else {
        setError(result.error || "Blog yazıları yüklenemedi")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoadingMore(false)
    }
  }, [searchQuery, selectedTag, sortBy])

  // Filtreler değiştiğinde yeniden yükle
  useEffect(() => {
    setPage(1)
    fetchPosts(1, true)
  }, [fetchPosts])

  // URL'i güncelle
  const updateURL = useCallback((newParams: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    
    router.push(`/blog?${current.toString()}`, { scroll: false })
  }, [searchParams, router])

  // Filtre işlemleri
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    updateURL({ search: query, tag: selectedTag, sort: sortBy })
  }

  const handleTagFilter = (tag: string) => {
    const newTag = tag === selectedTag ? "" : tag
    setSelectedTag(newTag)
    updateURL({ search: searchQuery, tag: newTag, sort: sortBy })
  }

  const handleSort = (sort: string) => {
    setSortBy(sort as any)
    updateURL({ search: searchQuery, tag: selectedTag, sort })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTag("")
    setSortBy("newest")
    updateURL({})
  }

  const loadMore = () => {
    if (!loadingMore && data?.hasMore) {
      fetchPosts(page + 1, false)
    }
  }

  // Tag'a tıklama
  const handleTagClick = (tagName: string) => {
    const newTag = tagName === selectedTag ? "" : tagName
    setSelectedTag(newTag)
    updateURL({ search: searchQuery, tag: newTag, sort: sortBy })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-6">
          {/* Search Bar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Arama</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Blog yazısı ara..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <div className="space-y-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <div
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={`cursor-pointer p-3 rounded-lg transition-colors ${
                      selectedTag === tag.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{tag.name}</span>
                      <span className="text-xs opacity-75">({tag.count})</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sıralama</h3>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("newest")}
                className="flex-1"
              >
                <SortDesc className="h-4 w-4 mr-1" />
                En Yeni
              </Button>
              <Button
                variant={sortBy === "oldest" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("oldest")}
                className="flex-1"
              >
                <SortAsc className="h-4 w-4 mr-1" />
                En Eski
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("popular")}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Popüler
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedTag || sortBy !== "newest") && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Aktif Filtreler</h3>
              <div className="space-y-2">
                {selectedTag && (
                  <Badge className="w-full justify-between">
                    {selectedTag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagFilter("")} />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="outline" className="w-full justify-between">
                    "{searchQuery}"
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch("")} />
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Tümünü Temizle
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Results Info */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {data?.totalCount || 0} blog yazısı bulundu
          </p>
        </div>

        {/* Blog List */}
        {data?.posts && data.posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.posts.map((post) => (
                <div key={post.id} className="group">
                  <div className="relative overflow-hidden rounded-lg mb-4" style={{ height: '200px' }}>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10"
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishDate).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} dk
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {data.hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Yükleniyor...
                    </>
                  ) : (
                    'Daha Fazla Yükle'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Blog yazısı bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Arama kriterlerinize uygun blog yazısı bulunamadı.
              </p>
              <Button onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </div>
      </div>
  )
}
