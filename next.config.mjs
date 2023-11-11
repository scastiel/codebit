import withMDX from '@next/mdx'
import { withPlausibleProxy } from 'next-plausible'
import remarkPrism from 'remark-prism'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

export default withMDX({
  options: {
    remarkPlugins: [remarkPrism],
  },
})(withPlausibleProxy()(nextConfig))
