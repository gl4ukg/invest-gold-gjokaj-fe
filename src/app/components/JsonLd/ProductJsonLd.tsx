import { Product } from "@/app/types/product.types";

interface ProductJsonLdProps {
  product: Product;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: `${product.name} - Unaza me porosi në Kosovë. Punuar me mjeshtëri nga artizanët tanë, me ar të pastër 14k dhe 18k.`,
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
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: product.price,
        priceCurrency: 'EUR'
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      availableDeliveryMethod: ['https://schema.org/OnSitePickup', 'https://schema.org/ParcelService'],
      additionalProperty: [{
        '@type': 'PropertyValue',
        name: 'CustomizableProduct',
        value: 'true'
      }, {
        '@type': 'PropertyValue',
        name: 'MadeToOrder',
        value: 'true'
      }, {
        '@type': 'PropertyValue',
        name: 'CustomOrder',
        value: 'Unaza me Porosi'
      }, {
        '@type': 'PropertyValue',
        name: 'CustomOrderLocation',
        value: 'Kosovë'
      }, {
        '@type': 'PropertyValue',
        name: 'CustomOrderDescription',
        value: 'Unaza me porosi në Kosovë'
      }],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'XK'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'XK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
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
