import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

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


const ZinxhirePage = async () => {
    const t = await getTranslations({ namespace: 'jewelry' });
    return (
        <main className="bg-[url('/images/header-01.png')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className='container mx-auto px-4 pt-44 pb-20 min-h-screen z-10 relative'>
            <h1 className="text-5xl text-white font-bold">
            {t('pageTitle')}
            </h1>
            <h2 className="mt-8 text-white max-w-2xl text-lg">
            {t('pageDescription')}
            </h2>
            <h3 className="mt-2 text-white max-w-2xl text-lg">
            {t('comingSoon')}
            </h3>
            <h2 className='mt-16 text-white max-w-2xl text-lg mb-4'>{t('secondDescription')}</h2>
            <Link href="/unaza" 
              className="inline-flex justify-center items-center h-12 px-6 bg-[#907C33] text-white rounded-md hover:bg-[#907C33]/90 transition-colors"
              aria-label={t('shopLink')}>
            {t('shopLink')}
            </Link>

            <section className="flex flex-col lg:flex-row gap-8">
                <div className="w-full">
                </div>
            </section>
          </div>
        </main>
    );
};

export default ZinxhirePage;
