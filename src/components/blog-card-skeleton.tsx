import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden border shadow-sm w-full max-w-[1000px] mx-auto p-0">
      {/* Görsel Skeleton - 250px yükseklik */}
      <div className="relative h-[350px] overflow-hidden bg-muted/60">
        <Skeleton className="w-full h-full animate-pulse" />
        {/* Featured badge skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-24 rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* İçerik Skeleton */}
      <div className="p-6 md:p-8">
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
            <Skeleton className="h-5 w-20 rounded-full animate-pulse" />
            <Skeleton className="h-5 w-14 rounded-full animate-pulse" />
          </div>
          
          {/* Başlık */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-4/5 animate-pulse" />
            <Skeleton className="h-8 w-3/4 animate-pulse" />
          </div>
          
          {/* Açıklama */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full animate-pulse" />
            <Skeleton className="h-5 w-5/6 animate-pulse" />
            <Skeleton className="h-5 w-3/4 animate-pulse" />
          </div>
          
          {/* Alt bilgiler */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20 animate-pulse" />
              <Skeleton className="h-4 w-24 animate-pulse" />
              <Skeleton className="h-4 w-16 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
