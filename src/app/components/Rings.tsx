'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { motion, useInView } from 'framer-motion';
import ProductsService from '@/app/services/products';
import type { Category } from '@/app/types/category.types';
import type { Product } from '@/app/types/product.types';
import ProductCard from '@/app/components/ProductCard';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type Props = {
  locale: string;
  initialCategories: Category[];
  initialCategoryId: string | null;
  initialProducts: Product[];
};

const RingsSection: React.FC<Props> = ({
  locale,
  initialCategories,
  initialCategoryId,
  initialProducts,
}) => {
  const t = useTranslations('rings');

  // hydrate with SSR data
  const [categories] = useState<Category[]>(initialCategories ?? []);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategoryId ?? undefined
  );
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const carouselRef = useRef(null);

  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const isCategoryInView = useInView(categoryRef, { once: true, amount: 0.3 });
  const isCarouselInView = useInView(carouselRef, { once: true, amount: 0.2 });

  // Only fetch when user changes category (client-side)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      try {
        setIsLoading(true);
        const res = await ProductsService.search({
          categoryIds: [selectedCategory],
          sortOrder: 'DESC',
          limit: 30,
        });
        setProducts(res?.items ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip fetching on first load if we already have initialProducts for this category
    if (selectedCategory && selectedCategory !== initialCategoryId) {
      fetchProducts();
    }
  }, [selectedCategory, initialCategoryId]);

  const ringsText: Record<string, string> = useMemo(
    () => ({
      'Ari i Verdhë': t('yellowGold'),
      'Ari i Bardhë': t('whiteGold'),
      'Ari Rozë': t('roseGold'),
      'Ari Dy-ngjyrësh': t('twoColorGold'),
      'Ari Shumëngjyrësh': t('multiColorGold'),
    }),
    [t]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };
  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const PrevArrow = (props: any) => {
    const { style, onClick } = props;
    return (
      <button
        className="custom-prev-arrow absolute bg-lightGray text-white text-sm py-1 px-2 rounded-md radius-2m top-[500px] left-1/2 transform -translate-x-1/2 mb-4"
        style={{ ...style, display: 'block' }}
        onClick={onClick}
        aria-label="Previous"
      >
        <GrFormPrevious />
      </button>
    );
  };

  const NextArrow = (props: any) => {
    const { style, onClick } = props;
    return (
      <button
        className="custom-next-arrow absolute bg-lightGray text-white text-sm py-1 px-2 rounded-md radius-2m top-[500px] left-1/2 transform -translate-x-1/2 mb-4 ml-16"
        style={{ ...style, display: 'block' }}
        onClick={onClick}
        aria-label="Next"
      >
        <GrFormNext />
      </button>
    );
  };

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section id="rings" className="py-12 bg-white relative overflow-hidden" ref={sectionRef}>
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isSectionInView ? 'visible' : 'hidden'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center" ref={titleRef}>
          <motion.div variants={itemVariants} animate={isTitleInView ? 'visible' : 'hidden'} initial="hidden">
            <h2 className="text-4xl font-bold text-primary font-[Poppins]" itemProp="name">
              {t('title')}
            </h2>
            <article itemProp="description">
              <p className="text-tertiary text-lg font-[Poppins] mt-4">{t('subtitle')}</p>
              <div itemScope itemType="https://schema.org/CollectionPage" className="hidden">
                <meta itemProp="name" content="Gold Rings Collection - Invest Gold Gjokaj" />
                <meta itemProp="description" content={t('subtitle')} />
                <meta
                  itemProp="keywords"
                  content="unaza fejese, unaza martese, rrathe ari, gold rings, engagement rings, wedding rings"
                />
              </div>
            </article>
          </motion.div>

          <motion.div
            className="flex justify-center"
            variants={imageVariants}
            animate={isTitleInView ? 'visible' : 'hidden'}
            initial="hidden"
          >
            <Image src="/images/um6.png" alt="Rings" width={300} height={300} />
          </motion.div>
        </div>

        <motion.div className="space-y-8 py-16" variants={containerVariants}>
          <motion.p className="text-center text-primary text-4xl font-bold" variants={itemVariants}>
            {t('rings')}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-4"
            ref={categoryRef}
            variants={containerVariants}
            initial="hidden"
            animate={isCategoryInView ? 'visible' : 'hidden'}
          >
            {categories?.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium border-2 border-primary ${
                  selectedCategory === category.id ? 'bg-primary text-white' : 'text-secondary'
                } hover:bg-[#907C33] hover:text-white transition-all duration-300`}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Fallback to category.name if it’s not one of the mapped labels */}
                {ringsText[category.name] ?? category.name}
                {category?.image && (
                  <Image
                    src={String(category.image)}
                    alt={`${category.name}-category`}
                    width={25}
                    height={25}
                    className="ml-2"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="mt-12"
            ref={carouselRef}
            variants={containerVariants}
            initial="hidden"
            animate={isCarouselInView ? 'visible' : 'hidden'}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-primary text-4xl"
                >
                  <AiOutlineLoading3Quarters />
                </motion.div>
              </div>
            ) : (
              <Slider {...sliderSettings} className="rings-slider">
                {products?.map((ring) => (
                  <motion.div
                    key={ring.id}
                    className="p-2 h-full"
                    variants={imageVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={ring} />
                  </motion.div>
                ))}
              </Slider>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RingsSection;
