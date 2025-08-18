/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Help with route group builds
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://p01--dolly-vibe-backend--jlqhr9wl7sxr.code.run/:path*',
      },
    ]
  },
}

export default nextConfig
