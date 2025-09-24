'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export default function RingsNavigation() {
  const t = useTranslations('navbar');
  const pathname = usePathname();

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-4">
          <div className="flex space-x-4 items-center">
            <Link
              href="/unaza-fejese"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === '/unaza-fejese' ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t('unazaFejese')}
            </Link>
            <Link
              href="/unaza-martese"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === '/unaza-martese' ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t('unazaMartese')}
            </Link>
            <Link
              href="/rrathe-fejese"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === '/rrathe-fejese' ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t('rratheFejese')}
            </Link>
            <Link
              href="/rrathe-martese"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === '/rrathe-martese' ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t('rratheMartese')}
            </Link>
            <Link
              href="/unaza"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === '/unaza' ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t('rings')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
