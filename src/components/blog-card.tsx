import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, Heart, Bookmark } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlogPost } from "@/app/api/posts/route"

interface BlogCardProps {
  post: BlogPost
  layout?: "vertical" | "horizontal"
}

interface BlogCardState {
  liked: boolean
  bookmarked: boolean
}

export function BlogCard({ post, layout = "vertical" }: BlogCardProps) {
  const [state, setState] = useState<BlogCardState>({
    liked: false,
    bookmarked: false
  })

  const formattedDate = new Date(post.publishDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState(prev => ({ ...prev, liked: !prev.liked }))
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState(prev => ({ ...prev, bookmarked: !prev.bookmarked }))
  }

  if (layout === "horizontal") {
    return (
      <Card className="overflow-hidden border hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <Link href={`/blog/${post.slug}`} className="block group">
            <div className="flex">
              {/* Image */}
              <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="192px"
                  unoptimized={post.thumbnail.includes('supabase.co')}
                  onError={(e) => {
                    console.error('Image load error:', post.thumbnail, e)
                    // Fallback to a placeholder
                    e.currentTarget.src = '/placeholder-image.svg'
                  }}
                />
                {post.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary text-xs">
                    ⭐
                  </Badge>
                )}
                
                {/* Like ve Bookmark Butonları */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={handleLike}
                    className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
                      state.liked 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-110'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${state.liked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
                      state.bookmarked 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-110'
                    }`}
                  >
                    <Bookmark className={`h-3 w-3 ${state.bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4 space-y-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} dk</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Vertical layout (default) - Büyük geniş kart
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-shadow w-full max-w-[1000px] mx-auto p-0">
      <Link href={`/blog/${post.slug}`} className="block group">
        {/* Görsel Üstte - 250px yükseklik */}
        <div className="relative h-[350px] overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 1200px"
              unoptimized={post.thumbnail.includes('supabase.co')}
              onError={(e) => {
                console.error('Image load error:', post.thumbnail, e)
                // Fallback to a placeholder
                e.currentTarget.src = '/placeholder-image.svg'
              }}
            />
            {post.featured && (
              <Badge className="absolute top-4 left-4 bg-primary shadow-lg">
                ⭐ Öne Çıkan
              </Badge>
            )}
            
            {/* Like ve Bookmark Butonları */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  state.liked 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-110'
                }`}
              >
                <Heart className={`h-4 w-4 ${state.liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  state.bookmarked 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-110'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${state.bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* İçerik Altta */}
          <div className="p-6 md:p-8 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Başlık ve Açıklama */}
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-base md:text-lg line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            
            {/* Meta Bilgiler */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} dk okuma</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
    </Card>
  )
}
