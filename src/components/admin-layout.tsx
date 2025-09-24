"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check authentication
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
    }
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 ml-0 md:ml-64",
        className
      )}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
