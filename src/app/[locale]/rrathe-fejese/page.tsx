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
    title: t('rratheFejese.title'),
    description: t('rratheFejese.description'),
    keywords: t('rratheFejese.keywords'),
    openGraph: {
      title: t('rratheFejese.title'),
      description: t('rratheFejese.description'),
      images: [{ url: '/images/unaze-fejese.png', width: 1200, height: 630, alt: t('rratheFejese.ogImageAlt') }],
      locale,
      type: 'website',
      siteName: 'Invest Gold Gjokaj'
    }
  };
}

export default async function RratheFejese({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages' });

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t('rratheFejese.heading')}
          </h1>
          <p className="text-lg text-tertiary max-w-3xl mx-auto">
            {t('rratheFejese.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/unaze-fejese.png"
              alt="Rrathe Fejese Invest Gold Gjokaj"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-primary mb-6">
              {t('rratheFejese.collectionTitle')}
            </h2>
            <ul className="space-y-4 text-lg text-tertiary">
              <li>{t('rratheFejese.feature1')}</li>
              <li>{t('rratheFejese.feature2')}</li>
              <li>{t('rratheFejese.feature3')}</li>
              <li>{t('rratheFejese.feature4')}</li>
              <li>{t('rratheFejese.feature5')}</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link 
            href="/unaza" 
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {t('rratheFejese.viewCollection')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheFejese.section1Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheFejese.section1Description')}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheFejese.section2Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheFejese.section2Description')}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">
              {t('rratheFejese.section3Title')}
            </h3>
            <p className="text-tertiary">
              {t('rratheFejese.section3Description')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
