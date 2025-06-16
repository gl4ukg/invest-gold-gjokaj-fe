import { Product } from "@/app/types/product.types";

interface ProductJsonLdProps {
  product: Product;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.name,
    image: product.images?.[0] || '/images/um6.png',
    sku: String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'Invest Gold Gjokaj'
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `https://investgoldgjokaj.com/unaza/${product.id}`,
      priceCurrency: 'EUR',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '100'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}
