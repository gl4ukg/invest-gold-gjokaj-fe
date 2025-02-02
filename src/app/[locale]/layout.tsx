import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '../context/CartContext';
import NavigationWrapper from "../components/NavigationWrapper";
import FooterWrapper from "../components/FooterWrapper";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://investgoldgjokaj.com'),
  title: {
    template: '%s | Invest Gold Gjokaj',
    default: 'Invest Gold Gjokaj - Premium Gold Jewelry in Kosovo'
  },
  description: 'Premium gold jewelry store in Kosovo. Engagement rings, wedding rings, gold bracelets, necklaces, and custom jewelry. Professional gold services with guaranteed quality.',
  keywords: [
    'gold jewelry kosovo',
    'engagement rings',
    'wedding rings',
    'gold bracelets',
    'gold necklaces',
    'custom jewelry',
    'unaza',
    'unaza fejese',
    'unaza martese',
    'rrathe fejese',
    'rrathe martese',
    'stoli ari',
    'rrathe ari',
    'zinxhir ari',
    'rrathe',
    'zinxhir',
    'goldschmuck kosovo'
  ],
  authors: [{ name: 'Invest Gold Gjokaj' }],
  creator: 'Invest Gold Gjokaj',
  publisher: 'Invest Gold Gjokaj',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'sq': '/sq',
      'de': '/de',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['sq_AL', 'de_DE'],
    url: 'https://investgoldgjokaj.com',
    siteName: 'Invest Gold Gjokaj',
    title: 'Invest Gold Gjokaj - Premium Gold Jewelry in Kosovo',
    description: 'Premium gold jewelry store in Kosovo. Engagement rings, wedding rings, gold bracelets, necklaces, and custom jewelry. Professional gold services with guaranteed quality.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Invest Gold Gjokaj - Premium Gold Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invest Gold Gjokaj - Premium Gold Jewelry in Kosovo',
    description: 'Premium gold jewelry store in Kosovo. Engagement rings, wedding rings, gold bracelets, necklaces, and custom jewelry.',
    images: ['/images/twitter-image.jpg'],
    creator: '@investgoldgjokaj',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
    // bing: 'your-bing-verification',
  },
  category: 'Jewelry Store',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  other: {
    'geo.region': 'XK',
    'geo.placename': 'Kosovo',
    'og:priceRange': '€€€',
    'business:contact_data:street_address': 'Pjeter Mazreku',
    'business:contact_data:locality': 'Gjakove',
    'business:contact_data:postal_code': '50000',
    'business:contact_data:country_name': 'Kosovo',
    'business:contact_data:email': 'investgold_2017@hotmail.com',
    'business:contact_data:phone_number': '+383 43 666 236'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const messages = await getMessages();

  return (
    <html lang="sq">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={`${poppins.variable} antialiased bg-white`}
        >
        <NextIntlClientProvider messages={messages}>
            <CartProvider>
              <NavigationWrapper />
              {children}
              <FooterWrapper />
              <Toaster position="bottom-right" />
            </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
