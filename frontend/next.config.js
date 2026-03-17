/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.railway.app', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.railway.app', pathname: '/**' },
      { protocol: 'https', hostname: 'pub-196aff3397614c7094f0c4318cef574e.r2.dev', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
