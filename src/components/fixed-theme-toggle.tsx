"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function FixedThemeToggle() {
  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/40 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <ThemeToggle />
      </div>
    </div>
  )
}