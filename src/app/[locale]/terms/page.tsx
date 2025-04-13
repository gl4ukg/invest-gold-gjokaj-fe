import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations();

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
            <h1 className="text-3xl text-primary font-bold mb-8">{t('terms.title')}</h1>
            
            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.introduction.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.introduction.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.acceptance.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.acceptance.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.products.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.products.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.pricing.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.pricing.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.orders.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.orders.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.shipping.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.shipping.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.returns.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.returns.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.intellectual.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.intellectual.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.liability.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.liability.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.changes.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.changes.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('terms.contact.title')}</h2>
                    <p className="text-tertiary mb-4">{t('terms.contact.content')}</p>
                </section>
            </div>
        </div>
    );
}
