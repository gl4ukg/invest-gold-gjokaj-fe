// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CategoriesService from '@/app/services/categories';
import ProductsService from '@/app/services/products';

import Header from '@/app/components/Header';
import AboutSection from '@/app/components/AboutSection';
import JewelrySection from '@/app/components/JewelerySection';
import ServicesSection from '@/app/components/ServicesSection';
import ContactSection from '@/app/components/ContactSection';
import RingsSection from '../components/Rings';

interface Props {
  params: Promise<{ locale: string }>;
}

// (optional) tweak revalidation if your APIs are static-ish
// export const revalidate = 60; // seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    openGraph: {
      title: t('home.ogTitle'),
      description: t('home.ogDescription'),
      images: [{ url: '/images/um6.png', width: 1200, height: 630, alt: t('home.ogImageAlt') }],
      locale,
      type: 'website',
      siteName: 'Invest Gold Gjokaj',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.twitterTitle'),
      description: t('home.twitterDescription'),
      images: ['/images/um6.png'],
    },
    alternates: {
      canonical: new URL(`/${locale}`, 'https://investgoldgjokaj.com').toString(),
      languages: { en: '/en', de: '/de', sq: '/sq' },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

export default async function Home({ params }: Props) {
  try {
    const { locale } = await params;
    if (!['en', 'de', 'sq'].includes(locale)) notFound();

    const categories = await CategoriesService.getAll();
    const initialCategoryId = categories?.[0]?.id ?? null;

    const initialProducts = initialCategoryId
      ? (await ProductsService.search({
          categoryIds: [initialCategoryId],
          sortOrder: 'DESC',
          limit: 30,
        }))?.items ?? []
      : [];

    const t = await getTranslations({ locale, namespace: 'about' });

    return (
      <>
        <Header />
        <main className="overflow-x-hidden">
          <AboutSection
            id="about"
            title={t('title')}
            description={t('subtitle')}
            imageSrc="/images/gold-story-01.png"
            imageAlt={t('title')}
          />

          <RingsSection
            locale={locale}
            initialCategories={categories}
            initialCategoryId={initialCategoryId}
            initialProducts={initialProducts}
          />

          <JewelrySection />
          <ServicesSection />
          <ContactSection />
        </main>
      </>
    );
  } catch (e) {
    notFound();
  }
}
