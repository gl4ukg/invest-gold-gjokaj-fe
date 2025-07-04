"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";

const JewelrySection: React.FC = () => {
  // Refs for scroll detection
  const router = useRouter();
  const t = useTranslations("jewelry");
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const isFirstSectionInView = useInView(firstSectionRef, {
    once: true,
    amount: 0.3,
  });
  const isSecondSectionInView = useInView(secondSectionRef, {
    once: true,
    amount: 0.3,
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

  const itemVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      <section
        ref={firstSectionRef}
        id="jewelry"
        className="bg-[url('/images/cover-01.webp')] bg-cover bg-center bg-no-repeat py-24"
      >
        <motion.div
          className="container mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate={isFirstSectionInView ? "visible" : "hidden"}
        >
          <motion.div className="flex justify-start" variants={itemVariants}>
            <motion.div
              className="w-full md:w-7/12 animate-slideInRight"
              variants={imageVariants}
            >
              <motion.p
                className="text-[#907C33] font-medium italic text-3xl md:text-4xl"
                variants={itemVariants}
              >
                {t("description")}
              </motion.p>
              <button className="bg-[#907C33] text-black py-2 px-4 rounded-md hover:bg-transparent hover:border-[#907C33] hover:text-[#907C33] border-2 border-[#907C33] transition-colors font-semibold shadow-md hidden" onClick={() => router.push('/zinxhire')} aria-label={t('seeMore')}>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section ref={secondSectionRef} className="bg-white py-32 jewelryTwo">
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isSecondSectionInView ? "visible" : "hidden"}
        >
          <motion.p
            className="text-center text-primary text-5xl"
            variants={itemVariants}
          >
            {t('title')}
          </motion.p>
          <motion.p
            className="text-center text-tertiary text-2xl mt-8"
            variants={itemVariants}
          >
            {t('notAvailable')}
          </motion.p>
          <Link href="/zinxhire" className="hidden text-primary font-medium">
            {t("seeMore")}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default JewelrySection;
