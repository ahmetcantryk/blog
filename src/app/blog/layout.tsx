import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Yazıları - Daily Words',
  description: 'Teknoloji, yazılım geliştirme ve dijital dönüşüm hakkında güncel blog yazıları. Kategoriler, arama ve filtreleme özellikleri ile kolayca içerik bulun.',
  keywords: ['blog yazıları', 'teknoloji blog', 'yazılım geliştirme', 'programlama', 'web teknolojileri', 'dijital dönüşüm', 'kategoriler', 'filtreleme'],
  openGraph: {
    title: 'Blog Yazıları - Daily Words',
    description: 'Teknoloji, yazılım geliştirme ve dijital dönüşüm hakkında güncel blog yazıları.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Daily Words',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Yazıları - Daily Words',
    description: 'Teknoloji, yazılım geliştirme ve dijital dönüşüm hakkında güncel blog yazıları.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}