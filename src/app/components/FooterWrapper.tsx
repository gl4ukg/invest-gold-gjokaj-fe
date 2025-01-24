'use client';

import { usePathname } from '@/i18n/routing';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/admin');
  const isLoginRoute = pathname.includes('/login');

  if (isAdminRoute || isLoginRoute) {
    return null;
  }

  return <Footer />;
}
