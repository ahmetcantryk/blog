"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Calendar,
  User,
  Clock
} from "lucide-react"
import { BlogPost } from "@/app/api/posts/route"

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "normal">("all")
  const router = useRouter()

  useEffect(() => {
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
        alert("Blog yazısı başarıyla silindi!")
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
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Yazıları</h1>
            <p className="text-muted-foreground">
              Tüm blog yazılarınızı görüntüleyin ve yönetin.
            </p>
          </div>
          <Button onClick={() => router.push("/admin/blog/new")} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Yeni Blog Ekle
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Blog başlığı, içerik, yazar veya etiket ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterFeatured === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterFeatured("all")}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Tümü ({posts.length})
                </Button>
                <Button
                  variant={filterFeatured === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterFeatured("featured")}
                >
                  Öne Çıkan ({posts.filter(p => p.featured).length})
                </Button>
                <Button
                  variant={filterFeatured === "normal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterFeatured("normal")}
                >
                  Normal ({posts.filter(p => !p.featured).length})
                </Button>
              </div>
            </div>
            
            {/* Results count */}
            <div className="text-sm text-muted-foreground mt-4">
              {filteredPosts.length} blog yazısı gösteriliyor
              {searchQuery && ` (${posts.length} toplam içinden)`}
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Başlık</th>
                    <th className="text-left p-4 font-medium">Yazar</th>
                    <th className="text-left p-4 font-medium">Tarih</th>
                    <th className="text-left p-4 font-medium">Etiketler</th>
                    <th className="text-left p-4 font-medium">Okuma</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-right p-4 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-muted/30 transition-colors">
                      {/* Title */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold line-clamp-1 max-w-xs">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                            {post.excerpt}
                          </p>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{post.author}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(post.publishDate).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Read Time */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{post.readTime} dk</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {post.featured ? (
                          <Badge variant="secondary" className="text-xs">
                            ⭐ Öne Çıkan
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Normal
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Önizle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deleting === post.id}
                          >
                            {deleting === post.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mr-1"></div>
                                Siliniyor
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Sil
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredPosts.length === 0 && posts.length > 0 && (
                <div className="p-12 text-center">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Arama sonucu bulunamadı</h3>
                  <p className="text-muted-foreground mb-4">
                    "{searchQuery}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Aramayı Temizle
                  </Button>
                </div>
              )}

              {posts.length === 0 && (
                <div className="p-12 text-center">
                  <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Henüz blog yazısı yok</h3>
                  <p className="text-muted-foreground mb-4">
                    İlk blog yazınızı oluşturmak için aşağıdaki butona tıklayın.
                  </p>
                  <Button onClick={() => router.push("/admin/blog/new")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    İlk Blog Yazısını Oluştur
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  )
}
