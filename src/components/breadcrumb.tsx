"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const allItems = [
    { label: "Ana Sayfa", href: "/" },
    ...items
  ]

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
            )}
            
            {index === 0 ? (
              <Link 
                href={item.href!} 
                className="flex items-center hover:text-foreground transition-colors"
                aria-label="Ana sayfaya git"
              >
                <Home className="h-3 w-3" />
              </Link>
            ) : item.href && index < allItems.length - 1 ? (
              <Link 
                href={item.href} 
                className="hover:text-foreground transition-colors truncate text-xs"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium truncate text-xs" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Schema.org JSON-LD için breadcrumb data generator
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  const allItems = [
    { label: "Ana Sayfa", href: "/" },
    ...items
  ]

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${baseUrl}${item.href}` : undefined
    }))
  }
}