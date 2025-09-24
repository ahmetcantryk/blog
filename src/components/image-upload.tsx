"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  type?: 'thumbnail' | 'content' | 'og-image'
  accept?: string
  maxSize?: number // in MB
  placeholder?: string
  required?: boolean
}

export function ImageUpload({
  label,
  value,
  onChange,
  type = 'thumbnail',
  accept = "image/*",
  maxSize = 5,
  placeholder = "Görsel URL'si girin veya yükleyin",
  required = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu çok büyük. Maksimum ${maxSize}MB olmalıdır.`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.')
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      const imageUrl = data.url

      setPreviewUrl(imageUrl)
      onChange(imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onChange(url)
    setError("")
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const clearImage = () => {
    setPreviewUrl("")
    onChange("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* URL Input */}
      <div className="space-y-2">
        <Input
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Doğrudan URL girin veya aşağıdan dosya yükleyin
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isUploading ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="text-center">
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Dosya yüklemek için tıklayın veya sürükleyip bırakın</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP, GIF (max {maxSize}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-lg border bg-muted">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 400px"
            />
            <Button
              onClick={clearImage}
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {previewUrl.startsWith('http') ? 'External URL' : 'Uploaded image'}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}