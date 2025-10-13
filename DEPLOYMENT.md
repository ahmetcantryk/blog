# Blog Projesi - Production Deployment Rehberi

Bu rehber, blog projenizi production ortamına deploy etmek için gerekli adımları içerir.

## 🚀 Hızlı Başlangıç

### 1. Environment Variables Ayarlama

Production ortamında aşağıdaki environment variables'ları ayarlayın:

```bash
# .env.production dosyasını kopyalayın ve değerleri güncelleyin
cp .env.production .env.local
```

**Önemli:** Production'da mutlaka değiştirmeniz gerekenler:
- `ADMIN_PASSWORD`: Güçlü bir şifre
- `ADMIN_SECRET_KEY`: Güçlü bir secret key
- `NEXT_PUBLIC_APP_URL`: Production domain'iniz
- Supabase production bilgileri

### 2. Production Build

```bash
# Production build
pnpm run build:prod

# Production start
pnpm run start:prod
```

## 📁 Dosya Yapısı

```
├── src/app/
│   ├── sitemap.ts          # Dinamik sitemap
│   ├── robots.ts           # SEO robots.txt
│   └── ...
├── .env                    # Development
├── .env.production         # Production template
├── .env.example           # Example template
└── next.config.ts         # Production optimizations
```

## 🔧 Konfigürasyon Detayları

### Sitemap
- Dinamik sitemap: `/sitemap.xml`
- Blog yazıları otomatik olarak eklenir
- Cache süresi: 1 saat

### SEO Optimizasyonları
- Meta tags dinamik olarak ayarlanır
- Open Graph ve Twitter Card desteği
- Canonical URL'ler
- Robots.txt otomatik oluşturulur

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Performance Optimizations
- Image optimization (WebP, AVIF)
- Code splitting
- Compression
- ISR (Incremental Static Regeneration)

## 🌐 Deployment Platformları

### Vercel
```bash
# Vercel CLI ile deploy
vercel --prod

# Environment variables'ları Vercel dashboard'dan ayarlayın
```

### Netlify
```bash
# Netlify CLI ile deploy
netlify deploy --prod

# Environment variables'ları Netlify dashboard'dan ayarlayın
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build:prod
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🔍 Monitoring ve Analytics

### Environment Variables
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ADS=false
```

### Performance Monitoring
- Build analizi: `pnpm run analyze`
- Bundle size kontrolü
- Core Web Vitals monitoring

## 🛠️ Troubleshooting

### Build Hataları
```bash
# TypeScript hatalarını kontrol et
pnpm run type-check

# ESLint hatalarını kontrol et
pnpm run lint
```

### Sitemap Sorunları
- Supabase bağlantısını kontrol edin
- Environment variables'ları doğrulayın
- `/sitemap.xml` endpoint'ini test edin

### Performance Sorunları
- Image optimization'ı kontrol edin
- Bundle size'ı analiz edin
- Cache ayarlarını gözden geçirin

## 📊 SEO Checklist

- [ ] Sitemap.xml çalışıyor mu?
- [ ] Robots.txt doğru mu?
- [ ] Meta tags dinamik mi?
- [ ] Open Graph tags var mı?
- [ ] Canonical URL'ler doğru mu?
- [ ] SSL sertifikası aktif mi?
- [ ] Page speed testleri geçiyor mu?

## 🔐 Security Checklist

- [ ] Admin şifreleri güçlü mü?
- [ ] Secret key'ler güvenli mi?
- [ ] Supabase RLS aktif mi?
- [ ] Security headers ayarlı mı?
- [ ] HTTPS aktif mi?

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Environment variables'ları kontrol edin
2. Build loglarını inceleyin
3. Supabase bağlantısını test edin
4. Browser console'u kontrol edin





