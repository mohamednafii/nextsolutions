/**
 * Cache Components is intentionally off: the site is fully static marketing
 * content, project routes must be allowed to have zero published entries, and
 * Activity-preserved hidden routes interfere with GSAP pinning.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  /**
   * One-page site for now (client decision, 2026-11-22): only the homepage, the project form and the
   * legal pages are open. The other pages stay in the codebase; their URLs land on the matching
   * homepage section. Temporary (307) so they can come back. Remove an entry to reopen a page.
   */
  async redirects() {
    const to = (from, hash, en = false) => ({ source: from, destination: `${en ? '/en' : '/'}#${hash}`, permanent: false })
    return [
      to('/services/:path*', 'nos-expertises'),
      to('/realisations/:path*', 'realisations'),
      to('/methode-et-tarifs', 'approche'),
      to('/agence', 'agence'),
      to('/en/services/:path*', 'nos-expertises', true),
      to('/en/work/:path*', 'realisations', true),
      to('/en/method-and-pricing', 'approche', true),
      to('/en/agency', 'agence', true),
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Hero film + poster: cache a week, revalidate in the background.
        source: '/:dir(videos|images)/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ]
  },
}

export default nextConfig
