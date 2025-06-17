import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">{t('title')}</p>
      <p className="text-xl mb-6">{t('description')}</p>
      <Link href="/" className="text-blue-600 underline">
        {t('backToHome')}
      </Link>
    </div>
  );
}
