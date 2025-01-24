'use client';

import { useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { motion, useInView } from 'framer-motion';

interface Ring {
  id: string;
  imageSrc: string;
  title: string;
  width: string;
  weight: string;
}

interface RingsCategory {
  id: string;
  name: string;
  imageSrc: string;
  rings: Ring[];
}

interface RingsSectionProps {
  categories: RingsCategory[];
}

const RingsSection: React.FC<RingsSectionProps> = ({ categories }) => {

  const t = useTranslations('rings')
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const carouselRef = useRef(null);

  // useInView hooks for different sections
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const isCategoryInView = useInView(categoryRef, { once: true, amount: 0.3 });
  const isCarouselInView = useInView(carouselRef, { once: true, amount: 0.2 });

  const selectedRings = categories.find((cat) => cat.id === selectedCategory)?.rings || [];

  const ringsText: { [key: string]: string }  = {
    "Ari i Verdhe": t('yellowGold'),
    "Ari i Bardhë": t('whiteGold'),
    "Ari Rozë": t('roseGold'),
    "Ari me 2 Ngjyra": t('twoColorGold'),
    "Ari Shumëngjyrësh": t('multiColorGold'),
  }

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

  const itemVariants = {
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

  const imageVariants = {
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

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const PrevArrow = (props: any) => {
    const { style, onClick } = props;
    return (
      <button
        className={`custom-prev-arrow absolute bg-lightGray text-white text-sm py-1 px-2 rounded-md radius-2m top-[300px] left-1/2 transform -translate-x-1/2 mb-4`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <GrFormPrevious />
      </button>
    );
  };
  
  const NextArrow = (props: any) => {
    const { style, onClick } = props;
    return (
      <button
        className={`custom-next-arrow absolute bg-lightGray text-white text-sm py-1 px-2 rounded-md radius-2m top-[300px] left-1/2 transform -translate-x-1/2 mb-4 ml-16`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <GrFormNext />
      </button>
    );
  };
  
  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section 
      id="rings" 
      className="py-12 bg-white relative"
      ref={sectionRef}
    >
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isSectionInView ? "visible" : "hidden"}
      >
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center"
          ref={titleRef}
        >
          <motion.div 
            variants={itemVariants}
            animate={isTitleInView ? "visible" : "hidden"}
            initial="hidden"
          >
            <h2 
              className="text-4xl font-bold text-primary font-[Poppins]" 
              itemProp="name"
            >
            {t('title')}
          </h2>
          <article itemProp="description">
            <p className="text-tertiary text-lg font-[Poppins] mt-4">
              {t('subtitle')}
            </p>
            <div 
              itemScope 
              itemType="https://schema.org/CollectionPage" 
              className="hidden"
            >
              <meta itemProp="name" content="Gold Rings Collection - Invest Gold Gjokaj" />
              <meta itemProp="description" content={t('subtitle')} />
              <meta itemProp="keywords" content="unaza fejese, unaza martese, rrathe ari, gold rings, engagement rings, wedding rings" />
            </div>
          </article>

          </motion.div>
          {/* Right: Featured Image */}
          <motion.div 
            className="flex justify-center"
            variants={imageVariants}
            animate={isTitleInView ? "visible" : "hidden"}
            initial="hidden"
          >
            <Image
              src={'/images/um6.png'}
              alt="Rings"
              width={300}
              height={300}
            />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <motion.div 
          className="space-y-8 py-16"
          variants={containerVariants}
        >
          <motion.p 
            className='text-center text-primary text-4xl font-bold'
            variants={itemVariants}
          >
            {t('rings')}
          </motion.p>
          
          {/* Category Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-4"
            ref={categoryRef}
            variants={containerVariants}
            initial="hidden"
            animate={isCategoryInView ? "visible" : "hidden"}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium border-2 border-primary ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-secondary'
                } hover:bg-[#907C33] hover:text-white transition-all duration-300`}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ringsText[category.name]}
                <Image 
                    src={category.imageSrc} 
                    alt={`${category.imageSrc}-category`}
                    width={25}
                    height={25}
                    className='ml-2' />
              </motion.button>
            ))}
          </motion.div>

          {/* Rings Carousel */}
          <motion.div 
            className="mt-12"
            ref={carouselRef}
            variants={containerVariants}
            initial="hidden"
            animate={isCarouselInView ? "visible" : "hidden"}
          >
            <Slider {...sliderSettings}>
              {selectedRings.map((ring) => (
                <motion.div 
                  key={ring.id} 
                  className="p-4"
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                    {/* Ring Image */}
                    <div className="relative w-full overflow-hidden">
                      <Image
                        src={ring.imageSrc}
                        alt={ring.title}
                        width={140}
                        height={140}
                        className="object-cover m-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Ring Details */}
                    <div className="p-4 text-center">
                      <h2 className="text-xl font-semibold text-[#907C33] font-[Poppins]">
                        {ring.title}
                      </h2>
                      <p className="text-sm text-tertiary my-2">{t('width')}: {ring.width}</p>
                      <p className="text-sm text-tertiary">{t('height')}: {ring.weight}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Slider>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RingsSection;
