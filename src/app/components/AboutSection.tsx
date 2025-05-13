"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AboutSectionProps {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean; // To toggle image and text alignment
}

const AboutSection: React.FC<AboutSectionProps> = ({
  id,
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}) => {
  // Refs for scroll trigger
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id={id}
      className="py-12 bg-white relative overflow-hidden"
      ref={sectionRef}
    >
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div
          className={`flex flex-col md:flex-row ${
            reverse ? "md:flex-row-reverse" : ""
          } items-center gap-8`}
        >
          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2 wow slideInLeft"
            variants={imageVariants}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={500}
              height={500}
              className=""
            />
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="w-full md:w-1/2 wow slideInRight"
            variants={itemVariants}
          >
            <motion.h2
              className="text-4xl font-bold text-primary mb-4 font-[Poppins]"
              itemProp="name"
            >
              {title}
            </motion.h2>
            <motion.article
              itemProp="description"
              className="text-gray-700"
              variants={itemVariants}
            >
              <motion.p
                className="text-lg text-tertiary leading-relaxed font-[Poppins]"
                variants={itemVariants}
              >
                {description}
              </motion.p>
              <div
                itemScope
                itemType="https://schema.org/JewelryStore"
                className="hidden"
              >
                <meta itemProp="name" content="Invest Gold Gjokaj" />
                <meta itemProp="description" content={description} />
                <meta itemProp="priceRange" content="€€€" />
                <meta itemProp="areaServed" content="Kosovo" />
              </div>
            </motion.article>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
