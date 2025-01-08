'use client';

import Image from 'next/image';

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
  return (
    <section id={id} className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col md:flex-row ${
            reverse ? 'md:flex-row-reverse' : ''
          } items-center gap-8`}
        >
          {/* Image Section */}
          <div
            className="w-full md:w-1/2 wow slideInLeft"
            data-wow-duration="0.5s"
            data-wow-delay=".3s"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={500}
              height={500}
              className=""
            />
          </div>

          {/* Text Section */}
          <div
            className="w-full md:w-1/2 wow slideInRight"
            data-wow-duration="0.5s"
            data-wow-delay=".1s"
          >
            <h1 className="text-5xl font-bold text-primary mb-4 font-[Poppins]">
              {title}
            </h1>
            <p className="text-lg text-tertiary leading-relaxed font-[Poppins] wow slideInRight"
              data-wow-duration="0.5s"
              data-wow-delay=".2s"
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
