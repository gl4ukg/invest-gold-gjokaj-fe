"use client";

import React from "react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import {
  FaRing,
  FaLink,
  FaGem,
  FaMagic,
  FaTools,
  FaClock,
  FaTruck,
  FaHandshake,
} from "react-icons/fa";

const ServicesSection = () => {
  const t = useTranslations("services");

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);
  const additionalServicesRef = useRef(null);

  // useInView hooks
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isCardsInView = useInView(cardsRef, { once: true, amount: 0.2 });
  const isAdditionalServicesInView = useInView(additionalServicesRef, {
    once: true,
    amount: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const additionalServiceVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const services = [
    {
      id: "rings",
      icon: <FaRing className="w-8 h-8 text-primary mb-4" />,
      name: t("items.rings.title"),
      description: t("items.rings.description"),
      keywords: "unaza fejese, unaza martese, engagement rings, wedding rings",
    },
    {
      id: "bracelets",
      icon: <FaLink className="w-8 h-8 text-primary mb-4" />,
      name: t("items.bracelets.title"),
      description: t("items.bracelets.description"),
      keywords: "rrathe ari, bylyzyk ari, gold bracelets, gold bangles",
    },
    {
      id: "necklaces",
      icon: <FaGem className="w-8 h-8 text-primary mb-4" />,
      name: t("items.necklaces.title"),
      description: t("items.necklaces.description"),
      keywords: "zinxhirë ari, qafore ari, gold chains, gold necklaces",
    },
    {
      id: "custom",
      icon: <FaMagic className="w-8 h-8 text-primary mb-4" />,
      name: t("items.custom.title"),
      description: t("items.custom.description"),
      keywords: "stoli të personalizuara, custom jewelry, custom gold",
    },
  ];

  const additionalServices = [
    {
      id: "repair",
      icon: <FaTools className="w-8 h-8 text-primary" />,
      name: t("items.repair.title"),
      description: t("items.repair.description"),
    },
    {
      id: "express",
      icon: <FaClock className="w-8 h-8 text-primary" />,
      name: t("items.express.title"),
      description: t("items.express.description"),
    },
    {
      id: "delivery",
      icon: <FaTruck className="w-8 h-8 text-primary" />,
      name: t("items.delivery.title"),
      description: t("items.delivery.description"),
    },
    {
      id: "guarantee",
      icon: <FaHandshake className="w-8 h-8 text-primary" />,
      name: t("items.guarantee.title"),
      description: t("items.guarantee.description"),
    },
  ];

  return (
    <section
      id="services"
      className="bg-[url('/images/cover2-01.png')] bg-cover bg-center bg-no-repeat py-24"
      ref={sectionRef}
    >
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isSectionInView ? "visible" : "hidden"}
      >
        <motion.div
          className="text-center mb-12"
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <h2
            className="text-4xl md:text-5xl font-medium text-primary mb-6"
            itemProp="name"
          >
            {t("title")}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
            itemProp="description"
          >
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Main Services */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isCardsInView ? "visible" : "hidden"}
        >
          {services?.map((service) => (
            <motion.article
              key={service.id}
              className="service-item h-full"
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center flex flex-col items-center h-full">
                {service.icon}
                <h3
                  className="text-xl font-semibold text-darkGray text-center mb-4"
                  itemProp="name"
                >
                  {service.name}
                </h3>
                <p
                  className="text-lightGray text-center text-sm flex-grow"
                  itemProp="description"
                >
                  {service.description}
                </p>
                <meta itemProp="keywords" content={service.keywords} />
                <meta itemProp="category" content="Jewelry" />
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Additional Services */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
          ref={additionalServicesRef}
          variants={containerVariants}
          initial="hidden"
          animate={isAdditionalServicesInView ? "visible" : "hidden"}
        >
          {additionalServices?.map((service) => (
            <motion.div
              key={service.id}
              className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-center"
              variants={additionalServiceVariants}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ duration: 0.2 }}
            >
              {service.icon}
              <h4 className="text-lg font-medium text-darkGray mt-3 mb-2">
                {service.name}
              </h4>
              <p className="text-sm text-lightGray text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* SEO Metadata */}
        <div
          itemScope
          itemType="https://schema.org/JewelryStore"
          className="hidden"
        >
          <meta itemProp="name" content="Invest Gold Gjokaj" />
          <meta itemProp="description" content={t("seoDescription")} />
          <meta
            itemProp="keywords"
            content="unaza fejese, unaza martese, rrathe ari, zinxhir ari, stoli të personalizuara, engagement rings, wedding rings, gold bracelets, gold chains, custom jewelry"
          />
          <div
            itemProp="hasOfferCatalog"
            itemScope
            itemType="https://schema.org/OfferCatalog"
          >
            <meta itemProp="name" content="Gold Jewelry Services" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
