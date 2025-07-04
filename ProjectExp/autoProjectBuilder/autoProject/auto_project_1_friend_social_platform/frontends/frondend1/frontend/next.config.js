/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 图片优化
  images: {
    domains: [
      'localhost',
      'your-domain.com',
      's3.amazonaws.com',
      'firebasestorage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  
  // 重写配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  
  // 头部配置
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
        ],
      },
    ];
  },
  
  // Webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 自定义webpack配置
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  
  // 压缩配置
  compress: true,
  
  // 生产环境优化
  swcMinify: true,
  
  // 类型检查
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint配置
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 输出配置
  output: 'standalone',
  
  // 国际化配置
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  
  // 性能监控
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
