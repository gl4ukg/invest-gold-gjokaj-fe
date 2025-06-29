export default function OrganizationJsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Invest Gold Gjokaj',
    url: 'https://investgoldgjokaj.com',
    logo: 'https://investgoldgjokaj.com/images/um6.png',
    image: 'https://investgoldgjokaj.com/images/um6.png',
    description: 'Zbuloni koleksionin premium të Invest Gold Gjokaj me bizhuteri të arit, unaza dhe rrathe të punuara me përkushtim në Kosovë. Tek ne gjeni bizhuteri unike të punuara me përsoshmëri.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pjeter Mazreku',
      addressLocality: 'Gjakove',
      addressRegion: 'Kosovo',
      postalCode: '50000',
      addressCountry: 'XK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '42.4318694',
      longitude: '20.4214281'
    },
    openingHours: [
      'Mo-Fr 08:00-17:00',
      'Sa-Su Closed'
    ],
    telephone: '+383 43 666 236',
    priceRange: '€€€',
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'EUR'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
