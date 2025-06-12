'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useParams } from 'next/navigation';

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
  const { itemCount, setIsCartOpen, isNavbarOpen, setIsNavbarOpen } = useCart();
  const pathname = usePathname();
  const { id } = useParams();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const homePath = `/${locale}`;
    
    if ((pathname === '/' || pathname === homePath) && window.location.hash) {
      const sectionId = window.location.hash.slice(1);
      
      const section = document.getElementById(sectionId);
      
      if (section) {
        setTimeout(() => {
          window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
          });
        }, 500);
      }
    }
  }, [pathname, locale]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const homePath = `${locale}`;
    const fullPath = `${locale}#${sectionId}`;
    
    setIsNavbarOpen(false);
    if (pathname === homePath) {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 70, behavior: 'smooth' });
      }
    } else {
      if(
        pathname === "/shop" 
        || pathname === "/configurator" 
        || pathname === "/checkout" 
        || pathname === "/terms" 
        || pathname === "/privacy"
        || pathname === `/order-confirmation/${id}`
        || pathname === `/order-confirmation`
        || pathname === `/order-confirmation/error`
        || pathname === `/order-confirmation/cancel`
        || pathname === `/shop/${id}`
      ){
        console.log("here")
        window.location.replace(`/${fullPath}`);
      } else {
        console.log("here 2")
        router.push(`/#${sectionId}`);
      }
    }
  };

  const changeLocale = (newLocale: string) => {
    if(pathname === "/shop"){
      window.location.replace(`/${newLocale}/shop`);
    } else if (pathname === `/shop/${id}`){
      window.location.replace(`/${newLocale}/shop/${id}`);
    } else if (pathname === "/configurator"){
      window.location.replace(`/${newLocale}/configurator`);
    } else if (pathname === "/checkout"){
      window.location.replace(`/${newLocale}/checkout`);
    } else if (pathname === "/terms"){
      window.location.replace(`/${newLocale}/terms`);
    } else if (pathname === "/privacy"){
      window.location.replace(`/${newLocale}/privacy`);
    } else if (pathname === "/order-confirmation/error"){
      window.location.replace(`/${newLocale}/order-confirmation/error`);
    } else if (pathname === "/order-confirmation/cancel"){
      window.location.replace(`/${newLocale}/order-confirmation/cancel`);
    } else if (pathname === "/order-confirmation"){
      window.location.replace(`/${newLocale}/order-confirmation`);
    } else if (pathname === `/order-confirmation/${id}`){
      window.location.replace(`/${newLocale}/order-confirmation/${id}`);
    } else {
      router.push(`${newLocale}`);
    }
    setIsNavbarOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-[9999] bg-black/70  transition-colors duration-300 
          ${isNavbarOpen ? '' : 'shadow-md'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={'/'} className="text-white text-xl font-bold flex-shrink-0">
          <Image src="/images/logo-01.svg" alt="logo" width={220} height={50} priority />
        </Link>

        {/* Desktop Navbar Links */}
        <ul className="hidden lg:flex space-x-6 mx-auto">
          {NAV_LINKS?.map((link) => (
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
            {LANGUAGE_LINKS?.map((lang) => (
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
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={` fixed top-18 left-0 w-full bg-black/70 transition-all duration-500 ${
          isNavbarOpen ? ' max-h-screen opacity-100 block pb-4' : 'block max-h-0 opacity-0 hidden'
        }`}
      >
        <ul className="text-center space-y-4">
          {NAV_LINKS?.map((link) => (
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
                <Link href={link.href} onClick={() => setIsNavbarOpen(false)} locale={locale} className="text-white hover:text-gray-400">
                  {t(link.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <hr className="text-white/30 my-2 " />
        {/* Mobile Language Switcher */}
        <ul className="flex justify-center mt-4 space-x-3">
          {LANGUAGE_LINKS?.map((lang) => (
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
              className="mx-auto mt-4 flex relative bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-dark transition-colors"
            >
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </button>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
