'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, useInView } from 'framer-motion';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse"></div>
});

const ContactSection: React.FC = () => {
  const t = useTranslations('contact');

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const mapRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  // useInView hooks
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isMapInView = useInView(mapRef, { once: true, amount: 0.3 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const infoVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      id="contact"
      className="bg-white bg-no-repeat py-12"
      ref={sectionRef}
    >
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isSectionInView ? "visible" : "hidden"}
      >
        <motion.div
          className="text-center"
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <h1 className="text-4xl md:text-5xl font-medium text-primary mb-6 text-center">
            {t('title')}
          </h1>
        </motion.div>

        <div className="flex flex-col space-y-8">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            variants={formVariants}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            className="bg-white py-8"
          >
            <form
              name="contactform"
              action="send_form_email.php"
              method="post"
              id="contact_form"
              className="space-y-4"
            >
              <div className="flex items-center justify-between space-x-4">
                <div className='w-1/2'>
                  <motion.div variants={inputVariants}>
                    <input
                      name="first_name"
                      type="text"
                      placeholder={t('form.firstName')}
                      className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </motion.div>
                </div>
                <div className='w-1/2'>
                  <motion.div variants={inputVariants}>
                    <input
                      name="last_name"
                      type="text"
                      placeholder={t('form.lastName')}
                      className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </motion.div>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className='w-1/2'>
                  <motion.div variants={inputVariants}>
                    <input
                      name="email"
                      type="email"
                      placeholder={t('form.email')}
                      className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </motion.div>
                </div>
                <div className='w-1/2'>
                  <motion.div variants={inputVariants}>
                    <input
                      name="phone"
                      type="text"
                      placeholder={t('form.phone')}
                      className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </motion.div>
                </div>
              </div>
              <div>
                <motion.div variants={inputVariants}>
                  <textarea
                    name="comments"
                    placeholder={t('form.message')}
                    className="w-full p-3 border border-primary h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </motion.div>
              </div>
              <div className="text-center">
                <motion.button
                  type="submit"
                  className="bg-primary text-white py-2 px-12 rounded-md hover:bg-[#7a6a2c] transition duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('form.send')}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info and Map */}
          <div className="flex lg:flex-row flex-col lg:space-x-6 space-y-6 lg:space-y-0">
            {/* Contact Information */}
            <motion.div
              ref={infoRef}
              variants={infoVariants}
              initial="hidden"
              animate={isInfoInView ? "visible" : "hidden"}
              className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-8"
            >
              <motion.h2 
                className="text-3xl font-bold text-primary mb-8 border-b pb-4"
                variants={titleVariants}
              >
                {t('informationContact')}
              </motion.h2>

              <div className="space-y-6">
                {/* Address */}
                <motion.div 
                  className="flex items-start space-x-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGray mb-1">{t('address')}</h3>
                    <p className="lg:text-lg text-primary">Pjeter Mazreku</p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  className="flex items-start space-x-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGray mb-1">{t('phone')}</h3>
                    <Link href="tel:+38343666236" className="lg:text-lg text-primary hover:text-primary/80 transition-colors">
                      +383 43 666 236
                    </Link>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="flex items-start space-x-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGray mb-1">{t('email')}</h3>
                    <a href="mailto:investgold_2017@hotmail.com" className="lg:text-lg text-primary hover:text-primary/80 transition-colors">
                      investgold_2017@hotmail.com
                    </a>
                  </div>
                </motion.div>

                {/* Opening Hours Section */}
                <motion.div 
                  className="mt-8 bg-gray-50 py-4 rounded-xl"
                  variants={itemVariants}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{t('openingHours')}</span>
                  </h3>

                  <div className="space-y-4">
                    <motion.div 
                      className="flex justify-between items-center py-3 bg-white shadow-sm"
                      variants={itemVariants}
                    >
                      <span className="font-medium text-darkGray">{t('weekdays')}</span>
                      <span className="text-primary">{t('hours.weekdays')}</span>
                    </motion.div>

                    <motion.div 
                      className="flex justify-between items-center py-3 bg-white shadow-sm"
                      variants={itemVariants}
                    >
                      <span className="font-medium text-darkGray">{t('saturday')}</span>
                      <span className="text-primary">{t('hours.saturday')}</span>
                    </motion.div>

                    <motion.div 
                      className="flex justify-between items-center py-3 bg-white shadow-sm"
                      variants={itemVariants}
                    >
                      <span className="font-medium text-darkGray">{t('sunday')}</span>
                      <span className="text-primary">{t('hours.sunday')}</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Schema.org structured data */}
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
            </motion.div>

            {/* Map */}
            <motion.div
              ref={mapRef}
              variants={mapVariants}
              initial="hidden"
              animate={isMapInView ? "visible" : "hidden"}
              className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg"
            >
              <Map />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
