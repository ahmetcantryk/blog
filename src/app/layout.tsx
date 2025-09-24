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
    default: "Daily Words - Güncel Blog Yazıları",
    template: "%s | Daily Words"
  },
  description: "Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu",
  keywords: ["blog", "teknoloji", "yazılım", "geliştirme", "programlama", "web tasarım", "güncel", "türkçe"],
  authors: [{ name: "Daily Words Team" }],
  creator: "Daily Words",
  publisher: "Daily Words",
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
    title: 'Daily Words - Güncel Blog Yazıları',
    description: 'Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu',
    siteName: 'Daily Words',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Daily Words - Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Words - Güncel Blog Yazıları',
    description: 'Her gün yeni blog yazıları, her gün yeni keşifler - Teknoloji, yazılım geliştirme ve yaşam blogu',
    images: ['/og-image.jpg'],
    creator: '@dailywords',
    site: '@dailywords',
  },
  alternates: {
    canonical: 'https://yourdomain.com',
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
    "name": "Daily Words",
    "description": "Güncel blog yazıları, teknoloji, yaşam ve daha fazlası için Daily Words'e hoş geldiniz.",
    "url": "https://yourdomain.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yourdomain.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Daily Words",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    }
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
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