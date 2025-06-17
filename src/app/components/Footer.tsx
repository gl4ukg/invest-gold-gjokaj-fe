"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">{t("footer.about")}</h3>
            <p className="text-sm text-gray-800 mb-4">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {t("terms.title")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {t("privacy.title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social and Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.followUs")}
            </h3>
            <div className="flex justify-center md:justify-start space-x-6 mb-4">
              <Link
                href="https://www.facebook.com/invest.goldGjokaj"
                target="_blank"
                aria-label="Facebook"
                className="hover:opacity-80 transition-opacity"
              >
                <FaFacebook className="text-2xl" />
              </Link>
              <Link
                href="https://www.instagram.com/investgold2017/"
                target="_blank"
                aria-label="Instagram"
                className="hover:opacity-80 transition-opacity"
              >
                <FaInstagram className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-800">
          <p>
            &copy; {currentYear} Gold Invest. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
