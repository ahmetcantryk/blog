"use client"

import { useEffect } from 'react'

export function AutoScroll() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null
    let hasScrolled = false

    const handleScroll = () => {
      if (hasScrolled) return

      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      scrollTimeout = setTimeout(() => {
        const blogsSection = document.getElementById('blogs')
        if (blogsSection) {
          blogsSection.scrollIntoView({ behavior: 'smooth' })
          hasScrolled = true
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  return null
}