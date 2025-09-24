import { Metadata } from 'next'
import { getBlogPostBySlug } from '@/lib/supabase-blog-storage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Blog yazısı bulunamadı - EveryDayBlog',
      description: 'Aradığınız blog yazısı bulunamadı.'
    }
  }

  // Use custom SEO fields if available, otherwise fallback to defaults
  const metaTitle = post.metaTitle || `${post.title} - EveryDayBlog`
  const metaDescription = post.metaDescription || post.excerpt
  const metaKeywords = post.metaKeywords && post.metaKeywords.length > 0 ? post.metaKeywords : post.tags
  
  const ogTitle = post.ogTitle || post.title
  const ogDescription = post.ogDescription || post.excerpt
  const ogImage = post.ogImage || post.thumbnail
  
  const twitterTitle = post.twitterTitle || ogTitle
  const twitterDescription = post.twitterDescription || ogDescription
  const twitterImage = post.twitterImage || ogImage

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'EveryDayBlog',
    ...(post.canonicalUrl && { 
      alternates: { 
        canonical: post.canonicalUrl 
      } 
    }),
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        }
      ],
      authors: [post.author],
      publishedTime: post.publishDate,
      tags: post.tags,
      siteName: 'EveryDayBlog',
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
      creator: '@everydayblog',
      site: '@everydayblog',
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

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  // Generate structured data for blog post
  const structuredData = post ? {
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
      "name": "Woyable",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://woyable.com/blog/${post.slug}`
    },
    "keywords": post.tags.join(", "),
    "articleSection": "Blog",
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readTime}M`
  } : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      {children}
    </>
  )
}