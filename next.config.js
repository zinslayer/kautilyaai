/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@nivo/core',
      '@nivo/geo',
      '@nivo/line',
      '@nivo/bar',
      '@nivo/pie',
      'reactflow',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? (() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          return require('@next/bundle-analyzer')({ enabled: true })
        } catch {
          console.warn('@next/bundle-analyzer not installed; run npm i -D @next/bundle-analyzer')
          return (config) => config
        }
      })()
    : (config) => config

const withPWA =
  process.env.ENABLE_PWA === 'true'
    ? (() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const withPWAInit = require('next-pwa')({
            dest: 'public',
            disable: process.env.NODE_ENV === 'development',
            register: true,
            skipWaiting: true,
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts',
                  expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
                },
              },
              {
                urlPattern: /\.(?:js|css|woff2)$/i,
                handler: 'StaleWhileRevalidate',
                options: { cacheName: 'static-assets' },
              },
              {
                urlPattern: ({ request }) => request.mode === 'navigate',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'pages',
                  expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
                },
              },
            ],
          })
          return withPWAInit
        } catch {
          console.warn('next-pwa not installed; set ENABLE_PWA=true after npm i next-pwa')
          return (config) => config
        }
      })()
    : (config) => config

module.exports = withPWA(withBundleAnalyzer(nextConfig))
