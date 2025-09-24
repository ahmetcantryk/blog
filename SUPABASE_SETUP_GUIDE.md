# 🚀 EveryDayBlog - Supabase Database Kurulum Rehberi

Bu rehber, EveryDayBlog projenizi JSON dosya sisteminden Supabase PostgreSQL veritabanına geçirmek için hazırlanmıştır.

## 📋 İhtiyaç Analizi

### Mevcut Yapı:
- **Blog Posts**: JSON dosyasında saklanan blog verileri
- **Admin Auth**: Environment variables ile tek admin kullanıcısı
- **File Storage**: Statik JSON dosya sistemi

### Gerekli Tablolar:
1. **blogs** - Blog yazıları
2. **admin_users** - Admin kullanıcı bilgileri  
3. **user_interactions** - Like/bookmark işlemleri (gelecek için)

---

## 🎯 Adım Adım Supabase Kurulumu

### 1. Supabase Hesabı ve Proje Oluşturma

#### 1.1 Hesap Oluşturma
```bash
1. https://supabase.com adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın
4. "New Project" butonuna tıklayın
```

#### 1.2 Proje Ayarları
```
- Project Name: everydayblog
- Database Password: [Güçlü bir şifre oluşturun - kaydedin!]
- Region: West Europe (eu-west-1) [Türkiye'ye en yakın]
- Pricing Plan: Free tier (başlangıç için yeterli)
```

### 2. Database Tabloları Oluşturma

#### 2.1 Supabase Dashboard'a Erişim
```
1. Proje oluşturulduktan sonra Dashboard'a gidin
2. Sol menüden "Table Editor" seçin
3. "Create a new table" butonuna tıklayın
```

#### 2.2 Blogs Tablosu
```sql
-- Table: blogs
CREATE TABLE blogs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    read_time INTEGER DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    thumbnail VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    
    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    meta_keywords TEXT[],
    canonical_url VARCHAR(500),
    og_title VARCHAR(255),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    twitter_title VARCHAR(255),
    twitter_description VARCHAR(500),
    twitter_image VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_blogs_publish_date ON blogs(publish_date DESC);
CREATE INDEX idx_blogs_tags ON blogs USING GIN(tags);
```

#### 2.3 Admin Users Tablosu
```sql
-- Table: admin_users
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk admin kullanıcısı ekleme
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrmu3HO', 'admin@everydayblog.com');
-- Password: admin123 (hash'lenmiş hali)
```

#### 2.4 User Interactions Tablosu (Gelecek için)
```sql
-- Table: user_interactions (like/bookmark için)
CREATE TABLE user_interactions (
    id BIGSERIAL PRIMARY KEY,
    blog_id BIGINT REFERENCES blogs(id) ON DELETE CASCADE,
    user_session VARCHAR(255), -- Session ID veya IP
    interaction_type VARCHAR(20) CHECK (interaction_type IN ('like', 'bookmark', 'view')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(blog_id, user_session, interaction_type)
);

CREATE INDEX idx_interactions_blog_id ON user_interactions(blog_id);
CREATE INDEX idx_interactions_type ON user_interactions(interaction_type);
```

### 3. Environment Variables Ayarlama

#### 3.1 Supabase Bilgilerini Alma
```
1. Supabase Dashboard > Settings > API
2. Aşağıdaki bilgileri kopyalayın:
   - Project URL
   - Project API Key (anon/public)
   - Service Role Key (secret)
```

#### 3.2 .env.local Dosyası
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Authentication (Supabase'e geçmeden önce)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SECRET_KEY=your-jwt-secret-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase Client Kurulumu

#### 4.1 Paket Yükleme
```bash
npm install @supabase/supabase-js
```

#### 4.2 Supabase Client Oluşturma
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

### 5. Mevcut JSON Verilerini Supabase'e Aktarma

#### 5.1 Migration Script
```typescript
// scripts/migrate-to-supabase.ts
import { supabaseAdmin } from '../src/lib/supabase'
import blogData from '../src/data/blog-posts.json'

async function migrateBlogPosts() {
  console.log('🚀 Blog verilerini Supabase\'e aktarıyor...')
  
  for (const post of blogData) {
    const { id, ...postData } = post
    
    const { error } = await supabaseAdmin
      .from('blogs')
      .insert({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        publish_date: postData.publishDate,
        read_time: postData.readTime,
        tags: postData.tags,
        thumbnail: postData.thumbnail,
        featured: postData.featured,
        // SEO fields
        meta_title: postData.metaTitle,
        meta_description: postData.metaDescription,
        meta_keywords: postData.metaKeywords,
        canonical_url: postData.canonicalUrl,
        og_title: postData.ogTitle,
        og_description: postData.ogDescription,
        og_image: postData.ogImage,
        twitter_title: postData.twitterTitle,
        twitter_description: postData.twitterDescription,
        twitter_image: postData.twitterImage
      })
    
    if (error) {
      console.error('❌ Hata:', post.title, error)
    } else {
      console.log('✅ Aktarıldı:', post.title)
    }
  }
  
  console.log('🎉 Migration tamamlandı!')
}

migrateBlogPosts()
```

#### 5.2 Migration Çalıştırma
```bash
npx tsx scripts/migrate-to-supabase.ts
```

### 6. Database Functions Güncelleme

#### 6.1 Blog Storage Service
```typescript
// src/lib/supabase-blog-storage.ts
import { supabase, supabaseAdmin } from './supabase'
import { BlogPost } from '@/app/api/posts/route'

export interface NewBlogPost {
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: number
  tags: string[]
  thumbnail: string
  featured: boolean
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('publish_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  return data.map(mapDbToBlogPost)
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Create blog post
export async function createBlogPost(newPost: NewBlogPost): Promise<BlogPost | null> {
  const slug = generateSlug(newPost.title)
  
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .insert({
      title: newPost.title,
      slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      author: newPost.author,
      publish_date: newPost.publishDate,
      read_time: newPost.readTime,
      tags: newPost.tags,
      thumbnail: newPost.thumbnail,
      featured: newPost.featured,
      meta_title: newPost.metaTitle,
      meta_description: newPost.metaDescription,
      meta_keywords: newPost.metaKeywords,
      canonical_url: newPost.canonicalUrl,
      og_title: newPost.ogTitle,
      og_description: newPost.ogDescription,
      og_image: newPost.ogImage,
      twitter_title: newPost.twitterTitle,
      twitter_description: newPost.twitterDescription,
      twitter_image: newPost.twitterImage
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Update blog post
export async function updateBlogPost(id: number, updatedPost: Partial<NewBlogPost>): Promise<BlogPost | null> {
  const updateData: any = {}
  
  if (updatedPost.title) {
    updateData.title = updatedPost.title
    updateData.slug = generateSlug(updatedPost.title)
  }
  if (updatedPost.excerpt) updateData.excerpt = updatedPost.excerpt
  if (updatedPost.content) updateData.content = updatedPost.content
  if (updatedPost.author) updateData.author = updatedPost.author
  if (updatedPost.publishDate) updateData.publish_date = updatedPost.publishDate
  if (updatedPost.readTime !== undefined) updateData.read_time = updatedPost.readTime
  if (updatedPost.tags) updateData.tags = updatedPost.tags
  if (updatedPost.thumbnail) updateData.thumbnail = updatedPost.thumbnail
  if (updatedPost.featured !== undefined) updateData.featured = updatedPost.featured
  
  // SEO fields
  if (updatedPost.metaTitle !== undefined) updateData.meta_title = updatedPost.metaTitle
  if (updatedPost.metaDescription !== undefined) updateData.meta_description = updatedPost.metaDescription
  if (updatedPost.metaKeywords !== undefined) updateData.meta_keywords = updatedPost.metaKeywords
  if (updatedPost.canonicalUrl !== undefined) updateData.canonical_url = updatedPost.canonicalUrl
  if (updatedPost.ogTitle !== undefined) updateData.og_title = updatedPost.ogTitle
  if (updatedPost.ogDescription !== undefined) updateData.og_description = updatedPost.ogDescription
  if (updatedPost.ogImage !== undefined) updateData.og_image = updatedPost.ogImage
  if (updatedPost.twitterTitle !== undefined) updateData.twitter_title = updatedPost.twitterTitle
  if (updatedPost.twitterDescription !== undefined) updateData.twitter_description = updatedPost.twitterDescription
  if (updatedPost.twitterImage !== undefined) updateData.twitter_image = updatedPost.twitterImage
  
  updateData.updated_at = new Date().toISOString()
  
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Delete blog post
export async function deleteBlogPost(id: number): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
  
  return true
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return mapDbToBlogPost(data)
}

// Helper function to map database row to BlogPost
function mapDbToBlogPost(dbRow: any): BlogPost {
  return {
    id: dbRow.id,
    title: dbRow.title,
    slug: dbRow.slug,
    excerpt: dbRow.excerpt,
    content: dbRow.content,
    author: dbRow.author,
    publishDate: dbRow.publish_date,
    readTime: dbRow.read_time,
    tags: dbRow.tags || [],
    thumbnail: dbRow.thumbnail,
    featured: dbRow.featured,
    metaTitle: dbRow.meta_title,
    metaDescription: dbRow.meta_description,
    metaKeywords: dbRow.meta_keywords,
    canonicalUrl: dbRow.canonical_url,
    ogTitle: dbRow.og_title,
    ogDescription: dbRow.og_description,
    ogImage: dbRow.og_image,
    twitterTitle: dbRow.twitter_title,
    twitterDescription: dbRow.twitter_description,
    twitterImage: dbRow.twitter_image
  }
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
```

### 7. Authentication Service Güncelleme

#### 7.1 Supabase Auth Service
```typescript
// src/lib/supabase-auth.ts
import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_SECRET_KEY || 'your-secret-key'

export interface AdminUser {
  id: number
  username: string
  email?: string
  isAdmin: boolean
}

// Verify admin credentials against database
export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single()
  
  if (error || !data) {
    console.log('User not found:', username)
    return null
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, data.password_hash)
  if (!isValidPassword) {
    console.log('Invalid password for user:', username)
    return null
  }
  
  // Update last login
  await supabaseAdmin
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id)
  
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    isAdmin: true
  }
}

// Generate JWT token
export function generateToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}

// Verify JWT token
export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

// Get token from request
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}
```

### 8. API Routes Güncelleme

#### 8.1 Import Değişiklikleri
```typescript
// Tüm API route'larında şu değişiklikleri yapın:

// ESKİ:
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostById, getBlogPostBySlug } from '@/lib/blog-storage'

// YENİ:
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostById, getBlogPostBySlug } from '@/lib/supabase-blog-storage'

// ESKİ:
import { verifyAdminCredentials, generateToken, verifyToken, getTokenFromRequest } from '@/lib/auth'

// YENİ:
import { verifyAdminCredentials, generateToken, verifyToken, getTokenFromRequest } from '@/lib/supabase-auth'
```

### 9. Row Level Security (RLS) Ayarlama

#### 9.1 Blogs Tablosu RLS
```sql
-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public read access for published blogs
CREATE POLICY "Public blogs are viewable by everyone" 
ON blogs FOR SELECT 
USING (true);

-- Admin full access
CREATE POLICY "Admin full access to blogs" 
ON blogs FOR ALL 
USING (auth.role() = 'service_role');
```

#### 9.2 Admin Users RLS
```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin users
CREATE POLICY "Service role access to admin_users" 
ON admin_users FOR ALL 
USING (auth.role() = 'service_role');
```

### 10. Deployment Hazırlığı

#### 10.1 Environment Variables (Production)
```env
# Production .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
ADMIN_SECRET_KEY=your-strong-jwt-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### 10.2 Vercel Deployment
```bash
# Environment variables'ları Vercel'e ekleyin
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ADMIN_SECRET_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

---

## 🔧 Uygulama Sırası

### Adım 1: Supabase Kurulumu
1. ✅ Supabase hesabı oluştur
2. ✅ Yeni proje oluştur
3. ✅ Database şifresi belirle

### Adım 2: Tablolar
1. ✅ `blogs` tablosunu oluştur
2. ✅ `admin_users` tablosunu oluştur  
3. ✅ `user_interactions` tablosunu oluştur
4. ✅ Index'leri ekle

### Adım 3: Veriler
1. ✅ İlk admin kullanıcısını ekle
2. ✅ Mevcut blog verilerini aktar
3. ✅ Verileri test et

### Adım 4: Kod Güncellemeleri
1. ✅ Supabase client'ı kur
2. ✅ Storage service'leri güncelle
3. ✅ Auth service'leri güncelle
4. ✅ API route'ları güncelle

### Adım 5: Security
1. ✅ RLS politikalarını ayarla
2. ✅ Environment variables'ları ayarla
3. ✅ Test et

### Adım 6: Production
1. ✅ Production environment'ı ayarla
2. ✅ Deploy et
3. ✅ Final test

---

## 🚨 Önemli Notlar

### Güvenlik
- **Service Role Key'i** sadece backend'de kullanın
- **RLS politikalarını** mutlaka ayarlayın
- **Environment variables'ları** güvenli tutun

### Performance
- **Index'ler** mutlaka ekleyin
- **Connection pooling** Supabase'de otomatik
- **Caching** stratejisi planlayın

### Backup
- **Supabase otomatik backup** yapar
- **Manual export** seçenekleri mevcut
- **Migration script'leri** saklayın

Bu rehber ile projenizi tamamen Supabase'e geçirebilirsiniz! 🎉
