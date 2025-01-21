'use client';

import { Link } from '@/i18n/routing';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* Copyright Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Gold Invest. All Rights Reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          <Link
            href="https://www.facebook.com/invest.goldGjokaj"
            target="_blank"
            aria-label="Facebook"
          >
            <FaFacebook className="text-white text-2xl" />
          </Link>
          <Link
            href="https://www.instagram.com/investgold2017/"
            target="_blank"
            aria-label="Instagram"
          >
            <FaInstagram className="text-white text-2xl" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
