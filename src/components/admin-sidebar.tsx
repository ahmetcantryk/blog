"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  Users,
  BarChart3,
  Home,
  LogOut,
  Menu,
  X
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Yazıları",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Yeni Yazı",
    href: "/admin/blog/new",
    icon: PlusCircle,
  },
  {
    title: "İstatistikler",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Yazarlar",
    href: "/admin/authors",
    icon: Users,
  },
  {
    title: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      localStorage.removeItem("admin-token")
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem("admin-token")
      router.push("/admin/login")
    }
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full bg-background border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center border-b border-border px-4",
            collapsed && "justify-center px-2"
          )}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">EveryDayBlog</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === "/admin/blog" && pathname.startsWith("/admin/blog"))
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "justify-center px-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              onClick={() => router.push("/")}
            >
              <Home className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>Siteye Git</span>}
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive",
                collapsed && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>Çıkış Yap</span>}
            </Button>
          </div>

          {/* Collapse Toggle - Desktop only */}
          <div className="hidden md:block border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "→" : "←"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
