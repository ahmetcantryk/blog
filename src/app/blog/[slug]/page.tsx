import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/logo"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { BlogShareButtons } from "@/components/blog-share-buttons"
import { 
  Calendar, 
  Clock, 
  User
} from "lucide-react"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/supabase-blog-storage"
import type { BlogPost } from "@/lib/supabase-blog-storage"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı - Woyable.com',
      description: 'Aradığınız blog yazısı bulunamadı.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://woyable.com'

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords || post.tags,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'Woyable.com',
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt,
      siteName: 'Woyable',
      images: [
        {
          url: post.ogImage || post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitterTitle || post.title,
      description: post.twitterDescription || post.excerpt,
      images: [post.twitterImage || post.thumbnail],
      creator: '@woyable',
    },
    alternates: {
      canonical: post.canonicalUrl || `${baseUrl}/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Server-side data fetching
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  // Get all posts for recommendations
  const allPosts = await getAllBlogPosts()
  
  // Get recommended posts (same tags or same author, excluding current post)
  const recommendedPosts = allPosts
    .filter(p => p.id !== post.id)
    .filter(p => 
      p.author === post.author || 
      p.tags.some(tag => post.tags.includes(tag))
    )
    .slice(0, 4) // Limit to 4 recommendations
  
  // If not enough recommendations, fill with latest posts
  const finalRecommendedPosts = recommendedPosts.length < 4
    ? [
        ...recommendedPosts,
        ...allPosts
          .filter(p => p.id !== post.id && !recommendedPosts.includes(p))
          .slice(0, 4 - recommendedPosts.length)
      ]
    : recommendedPosts
  const formattedDate = new Date(post.publishDate).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })


  // Website structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.thumbnail,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Woyable.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://woyable.com'}/logo.png`
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL || 'https://woyable.com'}/blog/${post.slug}`
    },
    "keywords": post.tags.join(", "),
    "wordCount": post.content.length,
    "timeRequired": `PT${post.readTime}M`
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
      
      {/* Logo Header */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
        </div>
      </div>
      
      {/* Compact Header Strip */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Hero Image - Compact */}
          <div className="relative overflow-hidden rounded-lg mb-6" style={{ height: '400px' }}>
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized={post.thumbnail.includes('supabase.co')}
            />
          </div>

          {/* Compact Meta Strip */}
          <div className="space-y-4">
            {/* Tags Row */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Etiketler:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="text-xs hover:bg-secondary/80 transition-colors cursor-pointer">
                          #{tag}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Etiket yok
                    </Badge>
                  )}
                </div>
              </div>
              {post.featured && (
                <Badge className="bg-primary text-xs w-fit">⭐ Öne Çıkan</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {post.title}
            </h1>

            {/* Compact Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} dk</span>
              </div>
              {/* Compact Actions */}
              <div className="flex items-center gap-1 ml-auto">
                <BlogShareButtons title={post.title} content={post.content} compact />
              </div>
            </div>

            {/* Excerpt - Compact */}
            <p className="text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Primary Focus */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Article Content */}
        <div className="prose prose-lg prose-slate max-w-none reading-content">
          <div 
            className="text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 p-6 bg-muted/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Bu yazıyla ilgili etiketler:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="text-sm hover:bg-secondary/80 transition-colors cursor-pointer">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Compact Share Section */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{post.author}</p>
              <p className="text-xs text-muted-foreground">Blog Yazarı</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Paylaş:</span>
            <BlogShareButtons title={post.title} content={post.content} />
          </div>
        </div>

      </article>

      {/* Recommended Posts Carousel - Full Width */}
      {finalRecommendedPosts.length > 0 && (
        <div className="bg-muted/20 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center">Önerilen Yazılar</h2>
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {finalRecommendedPosts.map((recommendedPost) => (
                      <CarouselItem key={recommendedPost.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden p-0">
                          <Link href={`/blog/${recommendedPost.slug}`} className="block group">
                            <div className="relative aspect-video overflow-hidden">
                              <Image
                                src={recommendedPost.thumbnail}
                                alt={recommendedPost.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                              <div className="flex flex-wrap gap-1">
                                {recommendedPost.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <h4 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                                {recommendedPost.title}
                              </h4>
                              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                {recommendedPost.excerpt}
                              </p>
                              <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground">
                                <span>{recommendedPost.author}</span>
                                <span>•</span>
                                <span>{recommendedPost.readTime} dk</span>
                              </div>
                            </div>
                          </Link>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Controls */}
      <AccessibilityControls />
    </div>
  )
}
