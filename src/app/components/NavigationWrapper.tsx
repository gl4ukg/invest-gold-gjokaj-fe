'use client';

import { usePathname } from '@/i18n/routing';
import Navbar from './Navbar';

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/admin');
  const isLoginRoute = pathname.includes('/login');

  if (isAdminRoute || isLoginRoute) {
    return null;
  }

  return <Navbar />;
}
