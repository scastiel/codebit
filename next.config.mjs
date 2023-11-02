import { withPlausibleProxy } from 'next-plausible'
import path from 'path'
import webpack from 'webpack'

const { NormalModuleReplacementPlugin } = webpack

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    config.plugins = config.plugins || []
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /email\/render/,
        path.resolve('./renderEmailFix.js'),
      ),
    )
    // Important: return the modified config
    return config
  },
}

export default withPlausibleProxy()(nextConfig)
