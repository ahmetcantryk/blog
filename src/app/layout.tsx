import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FixedThemeToggle } from "@/components/fixed-theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Woyable - Güncel Blog Yazıları",
    template: "%s | Woyable"
  },
  description: "Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu",
  keywords: ["blog", "teknoloji", "yazılım", "geliştirme", "programlama", "web tasarım", "güncel", "türkçe"],
  authors: [{ name: "Woyable Team" }],
  creator: "Woyable",
  publisher: "Woyable",
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
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    title: 'Woyable - Güncel Blog Yazıları',
    description: 'Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu',
    siteName: 'Woyable',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Woyable - Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Woyable - Güncel Blog Yazıları',
    description: 'Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu',
    images: ['/og-image.jpg'],
    creator: '@woyable',
    site: '@woyable',
  },
  alternates: {
    canonical: 'https://woyable.com',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Website structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Woyable.com",
    "description": "Güncel blog yazıları, teknoloji, yaşam ve daha fazlası için Woyable.com'e hoş geldiniz.",
    "url": "https://woyable.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://woyable.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Woyable.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://woyable.com/logo.png"
      }
    }
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VG3R3KZB1H"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VG3R3KZB1H');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FixedThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}