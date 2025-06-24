import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jewelry' });

  return {  
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: [
      'zinxhirë ari',
      'zingjirë ari',
      'zingjirë qafe ne Gjakove',
      'zingjirë qafe në Kosovë',
      'zinxhir qafe në Kosovë',
      'zinxhir ari Gjakovë',
      'bizhuteri ari',
      'invest gold gjokaj',
      'invest gold zinxhire',
      'invest gold zingjire',
    ],
    alternates: {
      canonical: `https://investgoldgjokaj.com/${locale}/zinxhire`,
      languages: {
        sq: 'https://investgoldgjokaj.com/sq/zinxhire',
        en: 'https://investgoldgjokaj.com/en/zinxhire',
        de: 'https://investgoldgjokaj.com/de/zinxhire',
      },
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      url: `https://investgoldgjokaj.com/${locale}/zinxhire`,
      images: [
        {
          url: '/images/um6.png',
          width: 1200,
          height: 630,
          alt: t('ogImageAlt') || 'Zinxhirë të artë Invest Gold Gjokaj',
        },
      ],
      locale,
      siteName: 'Invest Gold Gjokaj',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/um6.png'],
    },
  };
}


const ZinxhirePage = () => {
    const t = useTranslations('jewelry');
    return (
        <main className="container mx-auto px-4 pt-36 pb-20 min-h-screen">
            <h1 className="text-5xl text-darkGray font-bold">
            {t('pageTitle')}
            </h1>
            <h2 className="mt-8 text-darkGray max-w-2xl text-lg">
            {t('pageDescription')}
            </h2>
            <h2>{t('secondDescription')}</h2>
            <Link href="/unaza" className="mt-8 text-darkGray max-w-2xl text-lg">
            {t('shopLink')}
            </Link>
            <Image src="/images/um6.png" alt="Zinxhirë të artë Invest Gold Gjokaj" width={1200} height={630} className="mt-8" />
            <h3 className="mt-8 text-darkGray max-w-2xl text-lg">
            {t('comingSoon')}
            </h3>

            <section className="flex flex-col lg:flex-row gap-8">
                <div className="w-full">
                </div>
            </section>
        </main>
    );
};

export default ZinxhirePage;
