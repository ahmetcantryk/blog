"use client"

import { useEffect, useState } from "react"

export function DayCounter() {
  const [days, setDays] = useState<number>(0)

  useEffect(() => {
    // Blog başlangıç tarihi (örnek: 1 Ocak 2024)
    const startDate = new Date('2024-01-01')
    const today = new Date()
    
    // Gün farkını hesapla
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    setDays(diffDays)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>Blog'un {days}. günü</span>
    </div>
  )
}

