import { useTranslations } from "next-intl";
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Image from "next/image";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import Header from "../components/Header";
import RingsSection from "../components/Rings";
import JewelrySection from "../components/JewelerySection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";

type Props = {
  params: { locale: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await params?.locale || 'sq';
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const metadata: Metadata = {
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    openGraph: {
      title: t('home.ogTitle'),
      description: t('home.ogDescription'),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('home.ogImageAlt'),
        },
      ],
      locale,
      type: 'website',
      siteName: 'Invest Gold Gjokaj',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.twitterTitle'),
      description: t('home.twitterDescription'),
      images: ['/images/og-image.jpg'],
    },
    alternates: {
      canonical: new URL(`/${locale}`, 'https://investgoldgjokaj.com').toString(),
      languages: {
        'en': '/en',
        'de': '/de',
        'sq': '/sq',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };

  return metadata;
}

export default async function Home({ params: { locale } }: Props) {
  const t = await getTranslations('about');

  return (
    <>
      <Header />
      <main>
        <AboutSection
          id="about"
          title={t("title")}
          description={t("subtitle")}
          imageSrc="/images/gold-story-01.png"
          imageAlt={t("title")}
        />
        <RingsSection />
        <JewelrySection/>
        <ServicesSection />
        <ContactSection />
      </main>
    </>
  );
}
