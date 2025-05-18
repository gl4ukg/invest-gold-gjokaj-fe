/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://investgoldgjokaj.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/_next/', '/admin/', '/login', '/signup'],
      },
    ],
  },
  exclude: ['/api/*', '/admin/*', '/login', '/signup'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  alternateRefs: [
    {
      href: 'https://investgoldgjokaj.com/sq',
      hreflang: 'sq',
    },
    {
      href: 'https://investgoldgjokaj.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://investgoldgjokaj.com/de',
      hreflang: 'de',
    },
  ],
}
