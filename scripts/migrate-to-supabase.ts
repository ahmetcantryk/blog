import { createClient } from '@supabase/supabase-js'
import blogData from '../src/data/blog-posts.json'

// Environment variables'ları manuel olarak ayarla
const supabaseUrl = 'https://ifpmquyhscmfdyjpkwaw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcG1xdXloc2NtZmR5anBrd2F3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU3ODg5NCwiZXhwIjoyMDc0MTU0ODk0fQ.la2bDVuK5lHooqWBOqzD-i5lYimJlJLc1aw2_yzm4d8'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase environment variables bulunamadı!')
  console.log('Gerekli değişkenler:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function migrateBlogPosts() {
  console.log('🚀 Blog verilerini Supabase\'e aktarıyor...')
  console.log('📊 Toplam', blogData.length, 'blog yazısı bulundu')
  
  // Önce Supabase bağlantısını test edelim
  console.log('🔗 Supabase bağlantısı test ediliyor...')
  console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  try {
    const { data, error } = await supabaseAdmin.from('blogs').select('count')
    if (error) {
      console.error('❌ Supabase bağlantı hatası:', error.message)
      console.log('💡 Lütfen Supabase veritabanının kurulduğundan ve environment variables\'ların doğru olduğundan emin olun.')
      return
    }
    console.log('✅ Supabase bağlantısı başarılı!')
  } catch (err) {
    console.error('❌ Supabase bağlantı hatası:', err)
    return
  }
  
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
        // SEO fields - JSON'da bu alanlar yok, null olarak ayarlıyoruz
        meta_title: null, 
        meta_description: null,
        meta_keywords: null,
        canonical_url: null,
        og_title: null,
        og_description: null,
        og_image: null,
        twitter_title: null,
        twitter_description: null,
        twitter_image: null
      })
    
    if (error) {
      console.error('❌ Hata:', post.title, error)
    } else {
      console.log('✅ Aktarıldı:', post.title)
    }
  }
  
  console.log('🎉 Migration tamamlandı!')
}
