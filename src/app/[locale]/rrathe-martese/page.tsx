import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import RingsNavigation from '@/app/components/RingsNavigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL('https://investgoldgjokaj.com'),
    title: t('rratheMartese.title'),
    description: t('rratheMartese.description'),
    keywords: t('rratheMartese.keywords'),
    openGraph: {
      title: t('rratheMartese.title'),
      description: t('rratheMartese.description'),
      images: [{ url: '/images/rrathe-martese.jpg', width: 1200, height: 630, alt: t('rratheMartese.ogImageAlt') }],
      locale,
      type: 'website',
      siteName: 'Invest Gold Gjokaj'
    }
  };
}

export default async function RratheMartese({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages' });

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t('rratheMartese.heading')}
          </h1>
          <p className="text-lg text-tertiary max-w-3xl mx-auto">
            {t('rratheMartese.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-primary mb-6">
              {t('rratheMartese.collectionTitle')}
            </h2>
            <ul className="space-y-4 text-lg text-tertiary">
              <li>{t('rratheMartese.feature1')}</li>
              <li>{t('rratheMartese.feature2')}</li>
              <li>{t('rratheMartese.feature3')}</li>
              <li>{t('rratheMartese.feature4')}</li>
              <li>{t('rratheMartese.feature5')}</li>
            </ul>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/unaze-martese.jpg"
              alt="Rrathe Martese Invest Gold Gjokaj"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <Link 
            href="/unaza" 
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {t('rratheMartese.viewCollection')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheMartese.section1Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheMartese.section1Description')}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheMartese.section2Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheMartese.section2Description')}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheMartese.section3Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheMartese.section3Description')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
