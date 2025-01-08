'use client';

import { useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

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

  const selectedRings = categories.find((cat) => cat.id === selectedCategory)?.rings || [];

  const ringsText: { [key: string]: string }  = {
    "Ari i Verdhe": t('yellowGold'),
    "Ari i Bardhë": t('whiteGold'),
    "Ari Rozë": t('roseGold'),
    "Ari me 2 Ngjyra": t('twoColorGold'),
    "Ari Shumëngjyrësh": t('multiColorGold'),
  }
  const PrevArrow = (props: any) => {
    const { style, onClick } = props;
    return (
      <button
        className={`custom-prev-arrow absolute bg-lightGray text-white text-sm py-1 px-2 rounded-md radius-2m top-[300px] left-1/2 transform -translate-x-1/2 mb-4`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        {t('prev')}
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
        {t('next')}
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
    <section id="rings" className="py-12 bg-white relative">
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
          {/* Left: Title and Subtitle */}
          <div className="text-left">
            <h1 className="text-5xl text-primary font-[Poppins]">{t('title')}</h1>
            <p className="text-tertiary font-[Poppins] mt-4">
              {t('subtitle')}
            </p>
          </div>
          {/* Right: Featured Image */}
          <div className="flex justify-center">
            <Image
              src={'/images/um6.png'}
              alt="Rings"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="space-y-8 py-16">
          <p className='text-center text-primary text-5xl'>{t('rings')}</p>
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium border-2 border-primary ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-secondary'
                } hover:bg-[#907C33] hover:text-white transition-all duration-300`}
              >
                {ringsText[category.name]}
                <Image 
                    src={category.imageSrc} 
                    alt={`${category.imageSrc}-category`}
                    width={25}
                    height={25}
                    className='ml-2' />
              </button>
            ))}
          </div>

          {/* Rings Carousel */}
          <Slider {...sliderSettings}>
            {selectedRings.map((ring) => (
              <div key={ring.id} className="p-4">
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
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default RingsSection;
