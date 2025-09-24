# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 blog application called "Woyable" built with TypeScript, Tailwind CSS, and Supabase. It's a full-stack blogging platform with admin functionality and optimized for SEO.

## Development Commands

```bash
# Development
pnpm run dev                    # Start development server

# Building
pnpm run build                  # Standard Next.js build
pnpm run build:fast            # Build without linting
pnpm run build:prod            # Production build with NODE_ENV=production
pnpm run build:ignore-errors   # Build ignoring lint errors

# Production
pnpm run start                  # Start production server
pnpm run start:prod            # Start with NODE_ENV=production

# Quality Checks
pnpm run lint                   # Run ESLint
pnpm run lint:ignore-errors    # Run ESLint quietly
pnpm run type-check            # Run TypeScript compiler check
pnpm run type-check:ignore-errors # Run TypeScript check with skipLibCheck

# Analysis
pnpm run analyze               # Bundle analyzer
pnpm run export                # Export static site
```

## Architecture & Structure

### Database Layer
- **Supabase Integration**: PostgreSQL database with Row Level Security (RLS)
- **Dual Storage Pattern**: 
  - `src/lib/blog-storage.ts` - JSON file storage (legacy)
  - `src/lib/supabase-blog-storage.ts` - Supabase storage (active)
  - `src/lib/supabase-auth.ts` - Authentication service

### Core Components Architecture
- **Admin System**: Full CRUD operations for blog management at `/admin`
- **Blog Display**: Dynamic routing with ISR at `/blog/[slug]`
- **Theme System**: Dark/light mode with `next-themes`
- **UI Components**: Radix UI + Tailwind CSS in `src/components/ui/`

### Key Features
- **SEO Optimized**: Dynamic sitemap, robots.txt, OpenGraph, Twitter Cards
- **Rich Text Editor**: TinyMCE integration for blog content
- **Responsive Design**: Mobile-first with accessibility controls
- **Performance**: Image optimization, code splitting, ISR

### Configuration
- **TypeScript**: Relaxed configuration (strict: false) for rapid development
- **Next.js Config**: Production/development environment switching with performance optimizations
- **Tailwind**: Custom theme with shadcn/ui components

### API Structure
```
/api/posts/           # Public blog posts API
/api/posts/[slug]     # Individual post by slug
/api/admin/auth       # Admin authentication
/api/admin/blog       # Admin blog CRUD operations
/api/admin/blog/[id]  # Individual post operations
/api/tags             # Blog tags management
```

### Environment Variables
Required for development and production:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
ADMIN_SECRET_KEY=your-jwt-secret
NEXT_PUBLIC_APP_URL=your-app-url
```

## Important Implementation Notes

### Database Schema
- `blogs` table: Complete blog post data with SEO fields
- `admin_users` table: Admin authentication
- `user_interactions` table: Future feature support

### Authentication
- JWT-based admin authentication
- Bcrypt password hashing
- Session persistence via localStorage

### Development vs Production
- Development: Ignores TypeScript and ESLint errors for faster iteration
- Production: Strict error checking, optimized builds, security headers

### SEO Features
- Dynamic sitemap generation from Supabase data
- Robots.txt with proper directives
- Structured data (JSON-LD) for search engines
- Meta tags, OpenGraph, and Twitter Cards per page

## Migration Context

This project is designed to migrate from JSON file storage to Supabase. The codebase includes:
- Migration scripts in the Supabase setup guide
- Dual storage system for backward compatibility
- Environment-based configuration switching

## Testing Strategy

Currently no automated tests are configured. When implementing tests:
- Use the existing package.json structure
- Consider the relaxed TypeScript configuration
- Test both storage systems (JSON and Supabase)