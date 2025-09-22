const locales = ['sq', 'en', 'de'];
const paths = [
  '/',
  '/unaza',
  '/zinxhire',
  '/checkout',
  '/login',
  '/blog',
  '/privacy',
  '/terms',
  '/configurator'
];

require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investgoldgjokaj.com';
    const response = await fetch(`${apiUrl}/products/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categoryIds: [],
        limit: 1000,
        page: 1,
        query: '',
        sortOrder: 'DESC'
      })
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data?.items || [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

module.exports = {
  siteUrl: 'https://investgoldgjokaj.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  generateIndexSitemap: true,
  sitemapSize: 5000,

  additionalPaths: async () => {
    // Get static paths
    const staticPaths = locales.flatMap((locale) =>
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

    // Get products and generate their paths
    const products = await getProducts();
    const productPaths = locales.flatMap((locale) =>
      products.map((product) => ({
        loc: `https://investgoldgjokaj.com/${locale}/unaza/${product.numericId}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updated_at || new Date().toISOString(),
        alternateRefs: locales.map((altLocale) => ({
          href: `https://investgoldgjokaj.com/${altLocale}/unaza/${product.numericId}`,
          hreflang: altLocale,
        })),
      }))
    );

    return [...staticPaths, ...productPaths];
  },
};
