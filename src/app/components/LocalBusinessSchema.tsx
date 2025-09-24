'use client';
import { type ReactElement } from 'react';

export default function LocalBusinessSchema(): ReactElement {
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Invest Gold Gjokaj',
    description: 'Dyqan i specializuar për unaza martese dhe fejese në Gjakovë. Ofrojmë koleksion të gjerë të unazave të arit, rrathe fejese dhe martese të punuara me mjeshtëri.',
    url: 'https://investgoldgjokaj.com',
    telephone: '+383 44 123 456',
    email: 'info@investgoldgjokaj.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pjeter Mazreku',
      addressLocality: 'Gjakovë',
      addressRegion: 'Gjakovë',
      postalCode: '50000',
      addressCountry: 'XK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '42.3833',
      longitude: '20.4333'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00'
      }
    ],
    priceRange: '€€',
    paymentAccepted: ['Cash', 'Credit Card'],
    currenciesAccepted: 'EUR',
    areaServed: ['Gjakovë', 'Prizren', 'Pejë', 'Prishtinë'],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Unaza Martese të Personalizuara',
          description: 'Shërbim i personalizimit të unazave të martesës sipas kërkesave tuaja'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Unaza Fejse të Personalizuara',
          description: 'Shërbim i personalizimit të unazave të fejesës sipas kërkesave tuaja'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Rrathe Fejese të Personalizuara',
          description: 'Dizajnim dhe krijim i unazave të fejesës sipas stilit tuaj'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Rrathe Martese të Personalizuara',
          description: 'Dizajnim dhe krijim i unazave të martesës sipas stilit tuaj'
        }
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Koleksioni i Unazave',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Unaza Martese',
          description: 'Koleksion i unazave të martesës në ar'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Unaza Fejese',
          description: 'Koleksion i unazave të fejesës në ar'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Rrathe Fejese',
          description: 'Koleksion i unazave të fejesës në ar'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Rrathe Martese',
          description: 'Koleksion i unazave të martesës në ar'
        }
      ]
    },
    sameAs: [
      'https://facebook.com/investgoldgjokaj',
      'https://instagram.com/investgoldgjokaj'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
    />
  );
}
