/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        path: false,
        buffer: false,
      }
    }

    return config
  },
}

export default nextConfig
