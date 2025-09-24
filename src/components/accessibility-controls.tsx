"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Type, 
  Minus, 
  Plus,
  Eye,
  Settings,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilityControlsProps {
  className?: string
}

export function AccessibilityControls({ className }: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)

  // Apply styles to document
  useEffect(() => {
    // Apply font size to reading content
    const readingElements = document.querySelectorAll('.reading-content, .reading-content *')
    readingElements.forEach((element) => {
      const el = element as HTMLElement
      el.style.fontSize = `${fontSize}px`
      el.style.lineHeight = `${lineHeight}`
    })
  }, [fontSize, lineHeight])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }

  const resetSettings = () => {
    setFontSize(16)
    setLineHeight(1.6)
    
    // Reset styles
    const readingElements = document.querySelectorAll('.reading-content, .reading-content *')
    readingElements.forEach((element) => {
      const el = element as HTMLElement
      el.style.fontSize = '16px'
      el.style.lineHeight = '1.6'
    })
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className={cn("fixed right-4 bottom-4 z-50", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full shadow-lg bg-background border-2"
          aria-label="Erişilebilirlik ayarları"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>

      {/* Controls Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-20 z-50 w-80">
          <Card className="shadow-xl border-2">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4" />
                  <h3 className="font-semibold">Erişilebilirlik Ayarları</h3>
                </div>

                {/* Font Size Controls */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span className="text-sm font-medium">Yazı Boyutu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFontSize}
                      disabled={fontSize <= 12}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm min-w-[3rem] text-center">{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFontSize}
                      disabled={fontSize >= 24}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>


                {/* Line Height Controls */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Satır Aralığı</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLineHeight(prev => Math.max(prev - 0.1, 1.2))}
                      disabled={lineHeight <= 1.2}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm min-w-[3rem] text-center">{lineHeight.toFixed(1)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLineHeight(prev => Math.min(prev + 0.1, 2.0))}
                      disabled={lineHeight >= 2.0}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetSettings}
                  className="w-full"
                >
                  Varsayılan Ayarlar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </>
  )
}
