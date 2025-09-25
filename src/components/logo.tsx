import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function Logo({ href = "/", className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-4xl",
    xl: "text-6xl md:text-7xl lg:text-8xl"
  }

  const logoContent = (
    <span className={cn("font-bold transition-colors", sizeClasses[size], className)}>
      <span className="text-blue-600 dark:text-blue-400">Woyable</span>
      <span className="text-black dark:text-white">.</span>
      <span className="text-blue-600 dark:text-blue-400">com</span>
    </span>
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
