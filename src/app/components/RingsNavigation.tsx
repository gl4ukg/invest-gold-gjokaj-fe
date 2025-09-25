'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export default function RingsNavigation() {
  const t = useTranslations('navbar');
  const pathname = usePathname();

  const links = [
    { href: "/unaza-fejese", label: "engagementRings" },
    { href: "/unaza-martese", label: "weddingRings" },
    { href: "/rrathe-fejese", label: "engagementBands" },
    { href: "/rrathe-martese", label: "weddingBands" },
    { href: "/unaza", label: "rings" },
  ];

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop navigation */}
        <div className="hidden md:flex justify-center py-4 space-x-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${pathname === link.href ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
            >
              {t(link.label)}
            </Link>
          ))}
        </div>

        {/* Mobile navigation - horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex space-x-4 py-4 w-max">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors rounded-lg flex-shrink-0 ${pathname === link.href ? 'bg-white text-primary' : 'text-white hover:bg-white/10'}`}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
