'use client';

import { usePathname } from '@/i18n/routing';
import Navbar from './Navbar';
import Cart from './Cart';
import { useCart } from '../context/CartContext';

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes('/admin');
  const isLoginRoute = pathname.includes('/login');
  const {isCartOpen, setIsCartOpen, isNavbarOpen, setIsNavbarOpen} = useCart();

  if (isAdminRoute || isLoginRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => {
        setIsCartOpen(false)
        setIsNavbarOpen(false)
        }} />
    </>
  );
}
