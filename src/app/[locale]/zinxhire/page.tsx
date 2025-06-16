import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Zinxhirë Ari në Kosovë | Invest Gold Gjokaj',
  description: 'Zbuloni koleksionin e zinxhirëve prej ari nga Invest Gold Gjokaj. Blej zinxhirë cilësorë në Kosovë për meshkuj dhe femra.',
  keywords: ['zinxhirë ari', 'zinxhir qafe në Kosovë', 'zinxhir ari Gjakovë', 'bizhuteri ari', 'invest gold gjokaj']
};

const ZinxhirePage = () => {
    const t = useTranslations('jewelry');
    return (
        <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">
                {t('pageTitle')}
                </h1>
                <h2 className="mt-2 text-gray-600 max-w-2xl">
                {t('pageDescription')}
                </h2>
            </header>

            <section className="flex flex-col lg:flex-row gap-8">
                <div className="w-full">
                </div>
            </section>
        </main>
    );
};

export default ZinxhirePage;
