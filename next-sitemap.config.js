const paths = [
  '/',
  '/unaza',
  '/rrathe-fejese',
  '/rrathe-martese',
  '/unaza-fejese',
  '/unaza-martese',
  '/privacy',
  '/terms',
  '/configurator',
  '/blog',
];

const excludedRoutes = [
  '/admin',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/checkout',
  '/order-confirmation',
];

require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investgoldgjokaj.com';

async function getBlogs() {
  try {
    const response = await fetch(`${API_URL}/blogs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }
    const blogs = await response.json();
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://investgoldgjokaj.com',
  generateRobotsTxt: true,
  exclude: excludedRoutes,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {},
  transform: async (config, path) => {
    const locales = ['en', 'de', 'sq'];
    const localizedPaths = locales.map(locale => `/${locale}${path}`);

    return localizedPaths.map(localizedPath => ({
      loc: `${config.siteUrl}${localizedPath}`,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: locales.map(altLocale => ({
        href: `${config.siteUrl}/${altLocale}${path.replace(/^\/[a-z]{2}\//, '/')}`,
        hreflang: altLocale,
      })),
    }));
  },
  additionalPaths: async (config) => {
    const result = [];
    const locales = ['en', 'de', 'sq'];

    try {
      // Add static paths
      for (const path of paths) {
        const localizedPaths = locales.map(locale => ({
          loc: `${config.siteUrl}/${locale}${path}`,
          changefreq: path === '/' ? 'daily' : 'weekly',
          priority: path === '/' ? 1.0 : 0.7,
          lastmod: new Date().toISOString(),
          alternateRefs: locales.map(altLocale => ({
            href: `${config.siteUrl}/${altLocale}${path}`,
            hreflang: altLocale,
          })),
        }));
        result.push(...localizedPaths);
      }

      // Fetch and add products
      const products = await getProducts();
      for (const product of products) {
        const path = `/unaza/${product.numericId || product.id}`;
        const localizedPaths = locales.map(locale => ({
          loc: `${config.siteUrl}/${locale}${path}`,
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date().toISOString(),
          alternateRefs: locales.map(altLocale => ({
            href: `${config.siteUrl}/${altLocale}${path}`,
            hreflang: altLocale,
          })),
        }));
        result.push(...localizedPaths);
      }

      // Fetch and add blogs
      const blogs = await getBlogs();
      for (const blog of blogs) {
        const path = `/blog/${blog.slug}`;
        const localizedPaths = locales.map(locale => ({
          loc: `${config.siteUrl}/${locale}${path}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: new Date(blog.updatedAt || blog.createdAt).toISOString(),
          alternateRefs: locales.map(altLocale => ({
            href: `${config.siteUrl}/${altLocale}${path}`,
            hreflang: altLocale,
          })),
        }));
        result.push(...localizedPaths);
      }
    } catch (error) {
      console.error('Error fetching data for sitemap:', error);
    }

    return result;
  },
};
