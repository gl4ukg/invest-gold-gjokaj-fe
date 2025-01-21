'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse"></div>
});

const ContactSection: React.FC = () => {
  const t = useTranslations('contact');

  return (
    <section
      id="contact"
      className="bg-white bg-no-repeat py-12"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-medium text-primary mb-6 text-center">
          {t('title')}
        </h1>

        <div className="flex flex-col space-y-8">
          {/* Contact Form */}
          <div className="bg-white py-8">
            <form
              name="contactform"
              action="send_form_email.php"
              method="post"
              id="contact_form"
              className="space-y-4"
            >
              <div className="flex items-center justify-between space-x-4">
                <div className='w-1/2'>
                  <input
                    name="first_name"
                    type="text"
                    placeholder={t('form.firstName')}
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className='w-1/2'>
                  <input
                    name="last_name"
                    type="text"
                    placeholder={t('form.lastName')}
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className='w-1/2'>
                  <input
                    name="email"
                    type="email"
                    placeholder={t('form.email')}
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className='w-1/2'>
                  <input
                    name="phone"
                    type="text"
                    placeholder={t('form.phone')}
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <textarea
                  name="comments"
                  placeholder={t('form.message')}
                  className="w-full p-3 border border-primary h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-12 rounded-md hover:bg-[#7a6a2c] transition duration-300"
                >
                  {t('form.send')}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info and Map */}
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Contact Information */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-primary mb-6">{t('informationContact')}</h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <svg className="w-7 h-7 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-xl font-medium text-primary">Pjeter Mazreku</p>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-7 h-7 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <Link href="tel:+38343666236">
                    <p className="text-xl font-medium text-primary">+383 43 666 236</p>
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-7 h-7 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-xl font-medium text-primary">info@investgoldgjokaj.com</p>
                </div>

                {/* Opening Hours Section */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {t('openingHours')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-lg font-medium text-primary">{t('hours.weekdays')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-lg font-medium text-primary">{t('hours.saturday')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-lg font-medium text-primary">{t('hours.sunday')}</p>
                    </div>
                  </div>
                </div>

                {/* Schema.org structured data for opening hours */}
                <div itemScope itemType="https://schema.org/JewelryStore" className="hidden">
                  <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                    <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday" />
                    <meta itemProp="opens" content="09:00" />
                    <meta itemProp="closes" content="20:00" />
                  </div>
                  <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                    <meta itemProp="dayOfWeek" content="Saturday" />
                    <meta itemProp="opens" content="09:00" />
                    <meta itemProp="closes" content="18:00" />
                  </div>
                  <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                    <meta itemProp="dayOfWeek" content="Sunday" />
                    <meta itemProp="closes" content="00:00" />
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full md:w-1/2">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
