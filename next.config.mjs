/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: every route is prerendered to HTML at build time.
  // Gives real per-route HTML for SEO + shareable case links, deployable
  // to any static host (GitHub Pages / Cloudflare Pages) with no server.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
