import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import "../styles/fonts.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '../context/CartContext';
import NavigationWrapper from "../components/NavigationWrapper";
import FooterWrapper from "../components/FooterWrapper";
import OrganizationJsonLd from "../components/JsonLd/OrganizationJsonLd";
import { StepProvider } from "../context/StepContext";

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
    default: 'Invest Gold Gjokaj | Stoli të Çmuara në Ari'
  },
  description: 'Zbuloni koleksionin tonë premium të bizhuterive dhe aksesorëve të arit. Gjeni bizhuteri unike të punuara me përsosmëri.',
  keywords: [
    'bizhuteri ari',
    'unaza ari',
    'byzylykë ari',
    'varëse ari',
    'bizhuteri me porosi',
    'dyqan bizhuterish',
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
    locale: 'sq_AL',
    alternateLocale: ['en_US', 'de_DE'],
    url: 'https://investgoldgjokaj.com',
    siteName: 'Invest Gold Gjokaj',
    title: 'Invest Gold Gjokaj - Partneri Juaj i Besuar',
    description: 'Partneri juaj i besuar për bizhuteri dhe aksesorë premium të arit. Zbuloni koleksionin tonë premium të arit për investim dhe stolive të mrekullueshme.',
    images: [
      {
        url: '/images/um6.png',
        width: 1200,
        height: 630,
        alt: 'Vitrina e Invest Gold Gjokaj',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invest Gold Gjokaj - Partneri Juaj i Besuar',
    description: 'Partneri juaj i besuar për bizhuteri dhe aksesorë premium të arit. Eksploroni koleksionin tonë të arit premium dhe metaleve të çmuara.',
    images: ['/images/um6.png'],
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
    google: 'mGEvDtaax8A0Q9cGa5Rv8geBjDvIlSQg8HL4tRuxrLs',
    // yandex: 'your-yandex-verification',
    // yahoo: 'your-yahoo-verification',
    // bing: 'your-bing-verification',
  },
  category: 'Dyqan Bizhuterish',
  classification: 'Biznes',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon_16x16.ico', sizes: '16x16' },
      { url: '/favicon_32x32.ico', sizes: '32x32' },
      { url: '/favicon_48x48.ico', sizes: '48x48' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  other: {
    'geo.region': 'XK',
    'geo.placename': 'Kosovë',
    'og:priceRange': '€€€',
    'business:contact_data:street_address': 'Pjeter Mazreku',
    'business:contact_data:locality': 'Gjakovë',
    'business:contact_data:postal_code': '50000',
    'business:contact_data:country_name': 'Kosovë',
    'business:contact_data:email': 'info@investgoldgjokaj.com',
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
    <html lang="sq" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon_32x32.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon_48x48.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={`${poppins.variable} antialiased bg-white overflow-x-hidden`}
        >
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
            <CartProvider>
              <StepProvider>
                <NavigationWrapper />
                {children}
                <FooterWrapper />
                <Toaster position="bottom-right" />
              </StepProvider>
            </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
