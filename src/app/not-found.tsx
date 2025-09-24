import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground max-w-md">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Blog Yazıları
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
