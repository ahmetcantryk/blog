"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface HeroAction {
  label: string
  href: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: boolean
  blur?: boolean
  title: string
  subtitle?: string
  actions?: HeroAction[]
  titleClassName?: string
  subtitleClassName?: string
  actionsClassName?: string
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = false,
      blur = false,
      title,
      subtitle,
      actions,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background",
          className,
        )}
        {...props}
      >
        {/* Kare Çizgili Background */}
        <div className="absolute inset-0 z-0">
          {/* Ana background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"></div>
          
          {/* Kare çizgiler - daha geniş ve light modda daha belirgin */}
          <div 
            className="absolute inset-0 opacity-40 dark:opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, #d1d5db 1px, transparent 1px),
                linear-gradient(to right, #d1d5db 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4 -translate-y-20"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
                titleClassName,
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "text-xl text-muted-foreground",
                  subtitleClassName,
                )}
              >
                {subtitle}
              </p>
            )}
            {actions && actions.length > 0 && (
              <div className={cn("flex gap-4", actionsClassName)}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    asChild
                  >
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => {
            const blogsSection = document.getElementById('blogs')
            if (blogsSection) {
              blogsSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-3 bg-current rounded-full mt-2"
              />
            </div>
            <span className="text-xs">Kaydır</span>
          </div>
        </motion.div>
      </section>
    )
  },
)
Hero.displayName = "Hero"

export { Hero }