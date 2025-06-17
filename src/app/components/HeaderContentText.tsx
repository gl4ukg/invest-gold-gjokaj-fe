
import { Link } from '@/i18n/routing';
import useIsDesktop from '../hooks/useIsDesktop';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ReusableModal = dynamic(() => import('./Modal'), {
  loading: () => <div className="loading-placeholder"></div>,
  ssr: false
});

const HeaderContentText = () => {
  const t = useTranslations('header');
  const isDesktop = useIsDesktop();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideoModal = () => setIsVideoOpen(true);
  const closeVideoModal = () => setIsVideoOpen(false);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.5
      }
    }
  };

    return (
        <>
        <div className="container mx-auto px-4 h-full flex items-center py-4 relative z-10">
            <div className="text-left animate-zoomIn">

                <h1 className="md:text-6xl text-5xl font-bold text-white" itemProp="name">
                    {t('title')}
                </h1>
                <h2 className="md:text-2xl text-lg mt-4" itemProp="description">
                    {t('subtitle')}
                </h2>
                <h3 className="md:text-lg text-base mt-4" itemProp="offers">
                    {t('secondSubtitle')}
                </h3>
                <div className="mt-6 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                    <Link href="#about" className="scroll-smooth">
                    <button
                        style={{ minWidth: '48px', minHeight: '48px', width: '200px' }}
                        className="bg-[#907C33] text-white py-2 px-6 rounded-md hover:bg-transparent hover:border hover:border-[#907C33] transition-all duration-300"
                        aria-label={t('seeMore')}
                    >
                        {t('seeMore')}
                    </button>
                    </Link>
                    <Link href="#video" className="scroll-smooth">
                    <button
                        onClick={openVideoModal}
                        style={{ minWidth: '48px', minHeight: '48px', width: '200px' }}
                        className="bg-transparent text-white border border-[#907C33] py-2 px-4 rounded-md hover:bg-[#907C33] transition-all duration-300"
                        aria-label={t('video')}
                    >
                        {t('video')}
                    </button>
                    </Link>
                </div>
            </div>
        </div>
      {/* Modal */}
      {isVideoOpen && (
        <ReusableModal isOpen={isVideoOpen} onClose={closeVideoModal}>
          <div className="relative w-full h-[400px]">
            <iframe
              id="video"
              src="https://glaukthaqi.com/video.mp4"
              title="Video Modal"
              className="absolute top-0 left-0 w-full h-full rounded-md"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </ReusableModal>
      )}
      </>
    )
}

export default HeaderContentText