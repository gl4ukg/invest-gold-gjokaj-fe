const locales = ['sq', 'en', 'de'];
const paths = ['/', '/unaza', '/zinxhire', '/checkout', '/login'];

module.exports = {
  siteUrl: 'https://investgoldgjokaj.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  generateIndexSitemap: true,
  sitemapSize: 5000,

  additionalPaths: async () => {
    return locales.flatMap((locale) =>
      paths.map((path) => {
        const cleanPath = path === '/' ? '' : path;
        const fullPath = `/${locale}${cleanPath}`;

        return {
          loc: `https://investgoldgjokaj.com${fullPath}`,
          changefreq: 'weekly',
          priority: path === '/' ? 1.0 : 0.7,
          lastmod: new Date().toISOString(),
          alternateRefs: locales.map((altLocale) => ({
            href: `https://investgoldgjokaj.com/${altLocale}${cleanPath}`,
            hreflang: altLocale,
          })),
        };
      })
    );
  },
};
