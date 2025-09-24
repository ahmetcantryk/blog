"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Facebook, 
  Twitter, 
  Linkedin,
  Play,
  Pause,
  Share2,
} from "lucide-react"

interface BlogShareButtonsProps {
  title: string
  content: string
  compact?: boolean
}

export function BlogShareButtons({ title, content, compact = false }: BlogShareButtonsProps) {
  const [isReading, setIsReading] = useState(false)

  const handleShare = async (platform: string) => {
    const url = window.location.href
    
    let shareUrl = ""
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
          alert("Link kopyalandı!")
        } catch (error) {
          console.error("Copy failed:", error)
        }
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const handleTextToSpeech = () => {
    if (!content) return

    if (isReading) {
      speechSynthesis.cancel()
      setIsReading(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = "tr-TR"
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onend = () => setIsReading(false)
      utterance.onerror = () => setIsReading(false)
      
      speechSynthesis.speak(utterance)
      setIsReading(true)
    }
  }

  if (compact) {
    return (
      <>
        <Button onClick={handleTextToSpeech} variant="ghost" size="sm">
          {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleShare("copy")}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleShare("twitter")}>
          <Twitter className="h-4 w-4" />
        </Button>
      </>
    )
  }

  return (
    <>
      <Button onClick={() => handleShare("twitter")} variant="outline" size="sm">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button onClick={() => handleShare("facebook")} variant="outline" size="sm">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button onClick={() => handleShare("linkedin")} variant="outline" size="sm">
        <Linkedin className="h-4 w-4" />
      </Button>
    </>
  )
}