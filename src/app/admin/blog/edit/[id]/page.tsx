"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminLayout } from "@/components/admin-layout"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft, Save, Plus, X, Loader2, Trash2, ChevronRight, ChevronDown, Settings, RefreshCw } from "lucide-react"
import { BlogPost } from "@/app/api/posts/route"

export default function EditBlogPost() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [featured, setFeatured] = useState(false)
  const [readTime, setReadTime] = useState(5)
  // SEO fields
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [metaKeywords, setMetaKeywords] = useState<string[]>([])
  const [newMetaKeyword, setNewMetaKeyword] = useState("")
  const [canonicalUrl, setCanonicalUrl] = useState("")
  const [ogTitle, setOgTitle] = useState("")
  const [ogDescription, setOgDescription] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [twitterTitle, setTwitterTitle] = useState("")
  const [twitterDescription, setTwitterDescription] = useState("")
  const [twitterImage, setTwitterImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [seoCollapsed, setSeoCollapsed] = useState(true)
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  // Auto-sync SEO fields
  const generateSlug = (text: string) => {
    // Türkçe karakterleri İngilizce karşılıklarına çevir
    const turkishCharMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    }
    
    let slug = text
    
    // Türkçe karakterleri değiştir
    Object.keys(turkishCharMap).forEach(char => {
      slug = slug.replace(new RegExp(char, 'g'), turkishCharMap[char])
    })
    
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire bırak
      .trim()
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .replace(/^-+|-+$/g, '') // Başta ve sonda tire varsa kaldır
  }

  // Auto-fill SEO fields when main fields change
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(value)
    }
    if (!ogTitle || ogTitle === title) {
      setOgTitle(value)
    }
    if (!twitterTitle || twitterTitle === title) {
      setTwitterTitle(value)
    }
    // Generate canonical URL from title
    const slug = generateSlug(value)
    if (slug && (!canonicalUrl || canonicalUrl.includes(generateSlug(title)))) {
      setCanonicalUrl(`https://woyable.com/blog/${slug}`)
    }
  }

  const handleExcerptChange = (value: string) => {
    setExcerpt(value)
    if (!metaDescription || metaDescription === excerpt) {
      setMetaDescription(value)
    }
    if (!ogDescription || ogDescription === excerpt) {
      setOgDescription(value)
    }
    if (!twitterDescription || twitterDescription === excerpt) {
      setTwitterDescription(value)
    }
  }

  const handleThumbnailChange = (value: string) => {
    setThumbnail(value)
    if (!ogImage || ogImage === thumbnail) {
      setOgImage(value)
    }
    if (!twitterImage || twitterImage === thumbnail) {
      setTwitterImage(value)
    }
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
    // Sync with meta keywords if they match
    const currentTagsStr = tags.join(',')
    const currentKeywordsStr = metaKeywords.join(',')
    if (!metaKeywords.length || currentKeywordsStr === currentTagsStr) {
      setMetaKeywords([...newTags])
    }
  }

  // Manual SEO sync function
  const syncSEOFields = () => {
    // Sync meta title from title
    if (title) {
      setMetaTitle(title)
      setOgTitle(title)
      setTwitterTitle(title)
    }
    
    // Sync meta description from excerpt
    if (excerpt) {
      setMetaDescription(excerpt)
      setOgDescription(excerpt)
      setTwitterDescription(excerpt)
    }
    
    // Sync images from thumbnail
    if (thumbnail) {
      setOgImage(thumbnail)
      setTwitterImage(thumbnail)
    }
    
    // Sync meta keywords from tags
    if (tags.length > 0) {
      setMetaKeywords([...tags])
    }
    
    // Generate canonical URL from title
    if (title) {
      const slug = generateSlug(title)
      setCanonicalUrl(`https://woyable.com/blog/${slug}`)
    }
    
    setSuccess("SEO alanları başarıyla senkronize edildi!")
    setTimeout(() => setSuccess(""), 3000)
  }

  useEffect(() => {
    // Load blog post - authentication is handled by AdminLayout
    loadBlogPost()
  }, [postId])

  const loadBlogPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`)
      const data = await response.json()

      if (response.ok) {
        const blogPost = data.post
        setPost(blogPost)
        setTitle(blogPost.title)
        setExcerpt(blogPost.excerpt)
        setContent(blogPost.content)
        setAuthor(blogPost.author)
        setThumbnail(blogPost.thumbnail)
        setTags(blogPost.tags)
        setFeatured(blogPost.featured)
        setReadTime(blogPost.readTime)
        // SEO fields - if empty, auto-fill from main content
        setMetaTitle(blogPost.metaTitle || blogPost.title || "")
        setMetaDescription(blogPost.metaDescription || blogPost.excerpt || "")
        setMetaKeywords(blogPost.metaKeywords || blogPost.tags || [])
        setCanonicalUrl(blogPost.canonicalUrl || `https://woyable.com/blog/${blogPost.slug}`)
        setOgTitle(blogPost.ogTitle || blogPost.title || "")
        setOgDescription(blogPost.ogDescription || blogPost.excerpt || "")
        setOgImage(blogPost.ogImage || blogPost.thumbnail || "")
        setTwitterTitle(blogPost.twitterTitle || blogPost.title || "")
        setTwitterDescription(blogPost.twitterDescription || blogPost.excerpt || "")
        setTwitterImage(blogPost.twitterImage || blogPost.thumbnail || "")
      } else {
        setError(data.error || "Blog yazısı yüklenemedi")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()]
      handleTagsChange(newTags)
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    handleTagsChange(newTags)
  }

  const addMetaKeyword = () => {
    if (newMetaKeyword.trim() && !metaKeywords.includes(newMetaKeyword.trim())) {
      setMetaKeywords([...metaKeywords, newMetaKeyword.trim()])
      setNewMetaKeyword("")
    }
  }

  const removeMetaKeyword = (keywordToRemove: string) => {
    setMetaKeywords(metaKeywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const updateData = {
        title,
        excerpt,
        content,
        author,
        thumbnail,
        tags,
        featured,
        readTime,
        // SEO fields
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaKeywords: metaKeywords.length > 0 ? metaKeywords : undefined,
        canonicalUrl: canonicalUrl.trim() || undefined,
        ogTitle: ogTitle.trim() || undefined,
        ogDescription: ogDescription.trim() || undefined,
        ogImage: ogImage.trim() || undefined,
        twitterTitle: twitterTitle.trim() || undefined,
        twitterDescription: twitterDescription.trim() || undefined,
        twitterImage: twitterImage.trim() || undefined
      }

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Blog yazısı başarıyla güncellendi!")
        setTimeout(() => {
          router.push("/admin/dashboard?success=updated")
        }, 2000)
      } else {
        setError(result.error || "Blog güncellenirken bir hata oluştu")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }

    setDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Blog yazısı başarıyla silindi!")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1500)
      } else {
        setError(result.error || "Blog silinirken bir hata oluştu")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setDeleting(false)
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

  if (!post) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Blog yazısı bulunamadı</h2>
            <Button onClick={() => router.push("/admin/dashboard")}>
              Dashboard'a Dön
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri Dön
              </Button>
              <h1 className="text-xl font-bold">Blog Düzenle</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
              <Button type="submit" form="blog-form" disabled={saving || deleting}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Güncelle
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <form id="blog-form" onSubmit={handleUpdate}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-8" style={{
            gridTemplateColumns: seoCollapsed ? '1fr' : '2fr 1fr'
          }}>
            {/* Ana İçerik - Blog Bilgileri */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temel Bilgiler</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Blog yazınızın temel bilgilerini düzenleyin. SEO alanları otomatik senkronize edilir.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Blog yazısının başlığını girin"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Kısa Açıklama *</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => handleExcerptChange(e.target.value)}
                      placeholder="Blog yazısının kısa açıklamasını girin"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">İçerik *</Label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Blog yazısının tam içeriğini girin..."
                      height={600}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yazar ve Medya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Yazar *</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Yazar adını girin"
                      required
                    />
                  </div>

                  <ImageUpload
                    label="Thumbnail Görseli"
                    value={thumbnail}
                    onChange={handleThumbnailChange}
                    type="thumbnail"
                    placeholder="Thumbnail görsel URL'si girin"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Okuma Süresi (dakika)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                      min="1"
                      max="60"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Etiketler ve Ayarlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Etiketler</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Yeni etiket ekle"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={featured}
                      onCheckedChange={(checked) => setFeatured(checked === true)}
                    />
                    <Label htmlFor="featured">Öne çıkan yazı olarak işaretle</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEO Ayarları - Collapsible */}
            <div className={`transition-all duration-300 ${seoCollapsed ? 'w-0 overflow-hidden' : 'w-full'}`}>
              {!seoCollapsed && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>SEO Ayarları</span>
                        <Badge variant="secondary" className="text-xs">Otomatik Senkronize</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Bu alanlar temel bilgilerden otomatik güncellenir, ancak özelleştirebilirsiniz.
                      </p>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={syncSEOFields}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          SEO Alanlarını Senkronize Et
                        </Button>
                      </div>
                    </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Başlık</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="SEO için özel başlık"
                      maxLength={60}
                    />
                    <div className="text-xs text-muted-foreground">
                      {metaTitle.length}/60 karakter • {title && metaTitle === title ? 'Blog başlığından senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Açıklama</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Arama sonuçlarında görünecek açıklama"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-xs text-muted-foreground">
                      {metaDescription.length}/160 karakter • {excerpt && metaDescription === excerpt ? 'Kısa açıklamadan senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Anahtar Kelimeler</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newMetaKeyword}
                        onChange={(e) => setNewMetaKeyword(e.target.value)}
                        placeholder="SEO anahtar kelime ekle"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMetaKeyword())}
                      />
                      <Button type="button" onClick={addMetaKeyword} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {metaKeywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                          {keyword}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeMetaKeyword(keyword)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tags.length > 0 && metaKeywords.join(',') === tags.join(',') ? 'Etiketlerden senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://woyable.com/blog/post-slug"
                    />
                    <div className="text-xs text-muted-foreground">
                      {title && canonicalUrl.includes(generateSlug(title)) ? 'Başlıktan senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya (Open Graph)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Facebook, LinkedIn gibi platformlarda paylaşım görünümü için.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">OG Başlık</Label>
                    <Input
                      id="ogTitle"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Sosyal medyada görünecek başlık"
                    />
                    <div className="text-xs text-muted-foreground">
                      {title && ogTitle === title ? 'Blog başlığından senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">OG Açıklama</Label>
                    <Textarea
                      id="ogDescription"
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Sosyal medyada görünecek açıklama"
                      rows={2}
                    />
                    <div className="text-xs text-muted-foreground">
                      {excerpt && ogDescription === excerpt ? 'Kısa açıklamadan senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <ImageUpload
                    label="OpenGraph Görseli"
                    value={ogImage}
                    onChange={setOgImage}
                    type="og-image"
                    placeholder="Sosyal medyada görünecek görsel URL'si"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Twitter'da paylaşım görünümü için özel ayarlar.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterTitle">Twitter Başlık</Label>
                    <Input
                      id="twitterTitle"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      placeholder="Twitter'da görünecek başlık"
                    />
                    <div className="text-xs text-muted-foreground">
                      {title && twitterTitle === title ? 'Blog başlığından senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterDescription">Twitter Açıklama</Label>
                    <Textarea
                      id="twitterDescription"
                      value={twitterDescription}
                      onChange={(e) => setTwitterDescription(e.target.value)}
                      placeholder="Twitter'da görünecek açıklama"
                      rows={2}
                    />
                    <div className="text-xs text-muted-foreground">
                      {excerpt && twitterDescription === excerpt ? 'Kısa açıklamadan senkronize' : 'Özelleştirilmiş'}
                    </div>
                  </div>

                  <ImageUpload
                    label="Twitter Görseli"
                    value={twitterImage}
                    onChange={setTwitterImage}
                    type="og-image"
                    placeholder="Twitter'da görünecek görsel URL'si"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blog Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>ID:</strong> {post.id}</p>
                    <p><strong>Slug:</strong> {post.slug}</p>
                    <p><strong>Yayın Tarihi:</strong> {new Date(post.publishDate).toLocaleDateString("tr-TR")}</p>
                  </div>
                </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* SEO Toggle Button */}
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSeoCollapsed(!seoCollapsed)}
              className="flex items-center gap-2 shadow-lg"
            >
              {seoCollapsed ? (
                <>
                  <Settings className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO Ayarları</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <span className="hidden sm:inline">Gizle</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
