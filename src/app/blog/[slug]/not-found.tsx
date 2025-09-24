import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo Header */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-center">
            <Link href="/" className="text-2xl font-bold text-slate-800 dark:text-slate-200 hover:text-primary transition-colors">
              #DailyWords
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">Blog Yazısı Bulunamadı</h2>
            <p className="text-muted-foreground">
              Aradığınız blog yazısı mevcut değil veya taşınmış olabilir.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </Link>
            </Button>
            <Button asChild>
              <Link href="/blog">
                <Search className="mr-2 h-4 w-4" />
                Tüm Blog Yazıları
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
