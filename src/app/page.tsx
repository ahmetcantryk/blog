import { HomeBlogTabs } from "@/components/home-blog-tabs"
import { DayCounter } from "@/components/day-counter"
import { Hero } from "@/components/blocks/hero"
import { AutoScroll } from "@/components/auto-scroll"
import { Breadcrumb } from "@/components/breadcrumb"
import { Logo } from "@/components/logo"
import { getAllBlogPosts } from "@/lib/supabase-blog-storage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Woyable.com - Teknoloji ve Yazılım Blogu",
  description: "Her gün yeni blog yazıları, her gün yeni keşifler. Teknoloji, yazılım geliştirme, web teknolojileri ve dijital dönüşüm hakkında güncel blog içerikleri.",
  keywords: ["Woyable.com", "blog", "teknoloji", "yazılım geliştirme", "web teknolojileri", "next.js", "react", "typescript", "javascript", "yapay zeka", "programlama", "tutorial", "blog yazıları", "rehberler"],
  authors: [{ name: "Woyable.com" }],
  creator: "Woyable.com",
  publisher: "Woyable.com",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://woyable.com",
    title: "Woyable.com - Teknoloji ve Yazılım Blogu",
    description: "Her gün yeni blog yazıları, her gün yeni keşifler. Teknoloji, yazılım geliştirme, web teknolojileri ve dijital dönüşüm hakkında güncel blog içerikleri.",
    siteName: "Woyable.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Woyable.com - Teknoloji ve Yazılım Blogu",
    description: "Her gün yeni blog yazıları, her gün yeni keşifler. Teknoloji, yazılım geliştirme, web teknolojileri ve dijital dönüşüm hakkında güncel blog içerikleri.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function Home() {
  // Server-side data fetching for initial blog posts
  const recentPosts = await getAllBlogPosts(1, 8)

  return (
    <div className="min-h-screen bg-background">
      <AutoScroll />
      {/* Hero Section */}
      <Hero
        title="Woyable.com" 
        subtitle="Her gün yeni blog yazıları, her gün yeni keşifler. Teknoloji dünyasından güncel içerikler, yazılım geliştirme rehberleri ve dijital dönüşüm hikayeleri. Blog okuma alışkanlığınızı güçlendirin."
        actions={[
          {
            label: "Blogları Keşfet",
            href: "#blogs",
            variant: "default"
          }
        ]}
        titleClassName="text-6xl md:text-7xl lg:text-8xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight"
        subtitleClassName="text-xl md:text-2xl max-w-[800px] leading-relaxed text-slate-600 dark:text-slate-400"
        actionsClassName="mt-12"
        className="min-h-screen"
        gradient={false}
        blur={false}
        useLogo={true}
      />
      
      {/* Blog Section */}
      <section id="blogs" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Ana Sayfa" }
              ]} 
            />
          </div>
          
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Güncel Blog Yazıları
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Teknoloji dünyasından seçilmiş blog yazıları, rehberler ve uzman görüşleri ile bilginizi genişletin
            </p>
          </div>
          
          <HomeBlogTabs initialPosts={recentPosts} />
        </div>
      </section>
    </div>
  )
}