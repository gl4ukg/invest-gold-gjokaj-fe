'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { href: '#about', key: 'about' },
  { href: '#rings', key: 'rings' },
  { href: '#jewelry', key: 'jewelry' },
  { href: '#services', key: 'services' },
  { href: '#contact', key: 'contact' },
  { href: '/shop', key: 'shop' }, // External Page
];

const LANGUAGE_LINKS = [
  { code: 'sq', label: 'SQ' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

const Navbar = () => {
  const t = useTranslations('navbar');
  const { itemCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale()
  
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const homePath = `${locale}`;
    const fullPath = `${locale}#${sectionId}`;
    

    if (pathname === homePath) {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 70, behavior: 'smooth' });
      }
    } else {
      if(pathname === "/shop" || pathname === "/configurator"  || pathname === "/checkout"){
        window.location.replace(`/${fullPath}`);
      } else {
        router.push(fullPath);
      }
    }
  };

  const changeLocale = (newLocale: string) => {
    if(pathname === "/shop"){
      window.location.replace(`/${newLocale}/shop`);
    } else if (pathname === "/configurator"){
      window.location.replace(`/${newLocale}/configurator`);
    } else if (pathname === "/checkout"){
      window.location.replace(`/${newLocale}/checkout`);
    } else {
      router.push(`${newLocale}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-[9999] bg-black/70 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={'/'} className="text-white text-xl font-bold flex-shrink-0">
          <Image src="/images/logo-01.svg" alt="logo" width={220} height={50} priority />
        </Link>

        {/* Desktop Navbar Links */}
        <ul className="hidden lg:flex space-x-6 mx-auto">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              {link.href.startsWith('#') ? (
                <a
                  href={`/${locale}${link.href}`}
                  onClick={(e) => handleSectionClick(e, link.href.substring(1))}
                  className="text-white hover:text-gray-400 transition"
                >
                  {t(link.key)}
                </a>
              ) : (
                <Link href={link.href} locale={locale} className="text-white hover:text-gray-400">
                  {t(link.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Language & Cart */}
        <div className="flex items-center">
          {/* Language Switcher */}
          <ul className="hidden lg:flex space-x-3">
            {LANGUAGE_LINKS.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLocale(lang.code)}
                  className={`text-white hover:text-gray-400 transition ${
                    locale === lang.code ? 'font-bold underline' : ''
                  }`}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Button */}
          {itemCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:flex ml-3 relative bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-dark transition-colors"
            >
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="text-white cursor-pointer lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-16 left-0 w-full bg-black/80 transition-all duration-500 ${
          isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="text-center space-y-4">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              {link.href.startsWith('#') ? (
                <a
                  href={`/${locale}${link.href}`}
                  onClick={(e) => handleSectionClick(e, link.href.substring(1))}
                  className="text-white hover:text-gray-400 transition"
                >
                  {t(link.key)}
                </a>
              ) : (
                <Link href={link.href} locale={locale} className="text-white hover:text-gray-400">
                  {t(link.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <hr className="border-gray-600 my-2" />
        {/* Mobile Language Switcher */}
        <ul className="flex justify-center space-x-3">
          {LANGUAGE_LINKS.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLocale(lang.code)}
                className={`text-white hover:text-gray-400 transition ${
                  locale === lang.code ? 'font-bold underline' : ''
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
