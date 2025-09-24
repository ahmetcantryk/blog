"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import Head from "next/head"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  FileText, 
  Users, 
  Eye, 
  Search, 
  TrendingUp,
  Calendar,
  Clock,
  Star,
  BarChart3,
  Activity,
  Target
} from "lucide-react"
import { BlogPost } from "@/app/api/posts/route"

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "normal">("all")
  const router = useRouter()

  useEffect(() => {
    // Check for success messages from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    if (success === 'created') {
      setSuccessMessage("Yeni blog yazısı başarıyla oluşturuldu!")
      setTimeout(() => setSuccessMessage(""), 4000)
      // Clean URL
      window.history.replaceState({}, '', '/admin/dashboard')
    } else if (success === 'updated') {
      setSuccessMessage("Blog yazısı başarıyla güncellendi!")
      setTimeout(() => setSuccessMessage(""), 4000)
      // Clean URL
      window.history.replaceState({}, '', '/admin/dashboard')
    }

    // Load all posts
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts?limit=100")
      const data = await response.json()
      setPosts(data.posts)
      setFilteredPosts(data.posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on search query and featured filter
  const filterPosts = () => {
    let filtered = [...posts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply featured filter
    if (filterFeatured === "featured") {
      filtered = filtered.filter(post => post.featured)
    } else if (filterFeatured === "normal") {
      filtered = filtered.filter(post => !post.featured)
    }

    setFilteredPosts(filtered)
  }

  // Effect for filtering
  useEffect(() => {
    filterPosts()
  }, [searchQuery, filterFeatured, posts])

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }

    setDeleting(postId)
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        // Remove post from local state
        const updatedPosts = posts.filter(post => post.id !== postId)
        setPosts(updatedPosts)
        setSuccessMessage("Blog yazısı başarıyla silindi!")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        alert(result.error || "Blog silinirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Network error. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  // Calculate stats
  const totalPosts = posts.length
  const featuredPosts = posts.filter(p => p.featured).length
  const totalAuthors = new Set(posts.map(p => p.author)).size
  const recentPosts = posts.filter(p => {
    const postDate = new Date(p.publishDate)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return postDate >= weekAgo
  }).length

  const totalReadTime = posts.reduce((sum, post) => sum + post.readTime, 0)
  const avgReadTime = totalPosts > 0 ? Math.round(totalReadTime / totalPosts) : 0

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow, nocache, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow, noimageindex, max-video-preview:-1, max-image-preview:none, max-snippet:-1" />
      </Head>
      <AdminLayout>
        <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Blog yönetim panelinize hoş geldiniz. Tüm içeriklerinizi buradan yönetebilirsiniz.
            </p>
          </div>
          
          {successMessage && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <Activity className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => router.push("/admin/blog/new")}
            size="lg"
            className="h-12"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Yeni Blog Yazısı
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
            size="lg"
            className="h-12"
          >
            <Eye className="mr-2 h-5 w-5" />
            Siteyi Görüntüle
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-blue-700">Toplam Blog</CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalPosts}</div>
              <p className="text-xs text-blue-600 mt-1">
                {featuredPosts} öne çıkan yazı
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-700">Bu Hafta</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{recentPosts}</div>
              <p className="text-xs text-green-600 mt-1">
                Yeni yayınlanan
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-purple-700">Yazarlar</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{totalAuthors}</div>
              <p className="text-xs text-purple-600 mt-1">
                Aktif yazar
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-orange-700">Ort. Okuma</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{avgReadTime}</div>
              <p className="text-xs text-orange-600 mt-1">
                dakika
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Son Blog Yazıları</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/admin/blog")}
                  >
                    Tümünü Gör
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                        {post.featured && (
                          <Badge variant="secondary" className="h-5">
                            <Star className="h-3 w-3 mr-1" />
                            Öne Çıkan
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.publishDate).toLocaleDateString("tr-TR")}</span>
                        <span>•</span>
                        <span>{post.readTime} dk</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Önizle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                    </div>
                  </div>
                ))}
                
                {posts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Henüz blog yazısı yok</h3>
                    <p className="text-muted-foreground mb-4">
                      İlk blog yazınızı oluşturmak için başlayın.
                    </p>
                    <Button onClick={() => router.push("/admin/blog/new")}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      İlk Blog Yazısını Oluştur
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hızlı İstatistikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Toplam Okuma Süresi</span>
                  </div>
                  <span className="font-semibold">{totalReadTime} dk</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Öne Çıkan Oran</span>
                  </div>
                  <span className="font-semibold">
                    {totalPosts > 0 ? Math.round((featuredPosts / totalPosts) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Yazar Başına Ortalama</span>
                  </div>
                  <span className="font-semibold">
                    {totalAuthors > 0 ? Math.round(totalPosts / totalAuthors) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popüler Etiketler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const tagCounts = posts.reduce((acc, post) => {
                      post.tags.forEach(tag => {
                        acc[tag] = (acc[tag] || 0) + 1
                      })
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(tagCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([tag, count]) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag} ({count})
                        </Badge>
                      ))
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hızlı Erişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/blog/new")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Blog Yazısı
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/blog")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Tüm Yazıları Görüntüle
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push("/")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Siteyi Ziyaret Et
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </AdminLayout>
    </>
  )
}