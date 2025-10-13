import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Environment variables - Vercel için gerekli
  env: {
    // Admin authentication
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // App configuration
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ifpmquyhscmfdyjpkwaw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Dynamic Supabase hostname from environment
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{
            protocol: 'https' as const,
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            port: '',
            pathname: '/storage/v1/object/public/**',
          }]
        : []),
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Production optimizations
  ...(isProduction && {
    // Production'da build hatalarını kontrol et
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: false,
    },
    // Compression
    compress: true,
    // Performance optimizations
    poweredByHeader: false,
    generateEtags: true,
  }),
  
  // Development optimizations
  ...(!isProduction && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
  
  // Experimental features
  experimental: {
    // Next.js 15 optimizations
    ...(isProduction && {
      // Production optimizations
    }),
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Webpack konfigürasyonu
  webpack: (config, { dev, isServer }) => {
    // Development modda daha az strict
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Production optimizations
    if (isProduction) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    // Build hatalarını ignore et (sadece development)
    if (!isProduction) {
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Module not found/,
        /Can't resolve/,
      ];
    }
    
    return config
  },
};

export default nextConfig;
