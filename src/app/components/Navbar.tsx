'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Define Navbar Links
const NAV_LINKS = [
  { href: '#about', key: 'about' },
  { href: '#rings', key: 'rings' },
  { href: '#jewelry', key: 'jewelery' },
  { href: '#services', key: 'services' },
  { href: '#contact', key: 'contact' },
  { href: '#shop', key: 'shop' },
];

// Define Language Links
const LANGUAGE_LINKS = [
  { href: 'sq', label: 'sq/' },
  { href: 'en', label: 'en/' },
  { href: 'de', label: 'de' },
];

const Navbar = () => {
  const t = useTranslations('navbar');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 z-[99999] ${
        isScrolled ? 'bg-black/70 shadow-md' : 'bg-black/70 lg:bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link href="#page-top" className="text-white text-xl font-bold flex-shrink-0">
          <Image src="/images/logo-01.svg" alt="logo" width={220} height={50} priority />
        </Link>

        {/* Desktop Navbar Links */}
        <ul className="hidden lg:flex space-x-6 mx-auto">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link href={link.href} className="text-white hover:text-gray-400">
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language Links */}
        <ul className="hidden lg:flex space-x-0 ml-auto">
          {LANGUAGE_LINKS.map((lang) => (
            <li key={lang.href}>
              <Link href={lang.href} className="text-white hover:text-gray-400">
                {lang.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle Button */}
        <button
          className="text-white cursor-pointer lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-17 left-0 w-full bg-black/70 overflow-hidden transition-all duration-500 ease-in-out pb-2 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-4 p-4 text-center">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link href={link.href} className="text-white hover:text-gray-400">
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>
        <hr className="w-full border-gray-600 my-1" />
        <ul className="flex justify-center p-2">
          {LANGUAGE_LINKS.map((lang) => (
            <li key={lang.href}>
              <Link href={lang.href} className="text-white hover:text-gray-400">
                {lang.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
