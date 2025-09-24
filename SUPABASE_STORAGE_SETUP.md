# 📸 Supabase Storage Kurulum Rehberi

Bu rehber, blog görselleri için Supabase Storage kurulumunu açıklar.

## 🚀 Adım Adım Storage Kurulumu

### 1. Supabase Dashboard'da Storage Bucket Oluşturma

#### 1.1 Storage Bölümüne Git
```bash
1. Supabase Dashboard'a giriş yapın
2. Sol menüden "Storage" seçin
3. "Create a new bucket" butonuna tıklayın
```

#### 1.2 Bucket Ayarları
```
Bucket Name: blog-images
Public: true (✅ işaretleyin - görsellerin herkese açık olması için)
```

### 2. Storage Policies (RLS) Ayarlama

Storage bucket'ı oluşturduktan sonra güvenlik politikalarını ayarlayın:

#### 2.1 Public Read Policy
```sql
-- Storage bucket'ına public okuma izni ver
CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
```

#### 2.2 Admin Upload Policy
```sql
-- Admin kullanıcıları upload edebilsin
CREATE POLICY "Admin can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images');
```

#### 2.3 Admin Delete Policy
```sql
-- Admin kullanıcıları silebilsin
CREATE POLICY "Admin can delete blog images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images');
```

### 3. Klasör Yapısı

Storage bucket'ında şu klasör yapısı otomatik oluşacak:

```
blog-images/
├── thumbnails/          # Blog thumbnail görselleri
├── blog-content/        # Blog içeriği için görseller
└── og-images/          # OpenGraph ve Twitter görselleri
```

### 4. URL Formatı

Yüklenen görseller şu URL formatında erişilebilir olacak:

```
https://[YOUR_SUPABASE_URL]/storage/v1/object/public/blog-images/[folder]/[filename]
```

### 5. Test Etme

#### 5.1 Upload Testi
1. Admin panele gidin: `https://woyable.com/admin/blog/new`
2. Thumbnail bölümünden bir görsel yükleyin
3. Görsel preview görünmeli

#### 5.2 API Endpoint Testi
```javascript
// Konsola test kodu yapıştırın:
const formData = new FormData();
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  formData.append('file', file);
  formData.append('type', 'thumbnail');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log('Upload result:', result);
};
input.click();
```

## 🔧 Sorun Giderme

### Storage Bucket Görünmüyor
- Dashboard'da Storage sekmesini yenileyin
- Projenizin Free tier limitlerini kontrol edin

### Upload Çalışmıyor
1. Environment variables'ları kontrol edin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Storage policies'leri kontrol edin
3. Dosya boyutu 5MB'dan küçük olmalı
4. Sadece image formatları kabul edilir

### URL'ler Çalışmıyor
- Bucket'ın public olduğunu kontrol edin
- RLS policies'lerin doğru kurulduğunu kontrol edin

## 📊 Limitler

**Free Tier Limitler:**
- Storage: 1GB
- Transfer: 2GB/ay
- Request: 50,000/ay

## 🎯 Kullanım

Artık admin panelde:
1. **Drag & Drop** ile görsel yükleme
2. **URL girme** ile harici görseller
3. **Preview** özelliği
4. **Otomatik optimizasyon**

Özellikler kullanılabilir!