import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations();

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
            <h1 className="text-3xl text-primary font-bold mb-8">{t('privacy.title')}</h1>
            
            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.introduction.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.introduction.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.collection.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.collection.content')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        {['personal', 'payment', 'technical', 'usage'].map((item) => (
                            <li key={item} className="text-tertiary">
                                {t(`privacy.collection.items.${item}`)}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.usage.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.usage.content')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        {['process', 'improve', 'communicate', 'legal'].map((item) => (
                            <li key={item} className="text-tertiary">
                                {t(`privacy.usage.items.${item}`)}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.sharing.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.sharing.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.cookies.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.cookies.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.security.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.security.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.rights.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.rights.content')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        {['access', 'rectification', 'deletion', 'restriction', 'portability'].map((item) => (
                            <li key={item} className="text-tertiary">
                                {t(`privacy.rights.items.${item}`)}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.updates.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.updates.content')}</p>
                </section>

                <section>
                    <h2 className="text-2xl text-primary font-semibold mb-4">{t('privacy.contact.title')}</h2>
                    <p className="text-tertiary mb-4">{t('privacy.contact.content')}</p>
                </section>
            </div>
        </div>
    );
}
