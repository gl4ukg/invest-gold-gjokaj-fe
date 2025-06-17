
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

  // Removed animations to improve LCP

    return (
        <>
        <div className="container mx-auto px-4 h-full flex items-center py-4 relative z-10">
            <div className="text-left">
                <div className="space-y-4">
                    <h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                        itemProp="name"
                    >
                        {t('title')}
                    </h1>
                    <h2 
                        className="md:text-2xl text-lg font-semibold text-white"
                        itemProp="description"
                    >
                        {t('subtitle')}
                    </h2>
                    <h3 
                        className="md:text-lg text-base text-white/90"
                        itemProp="offers"
                    >
                        {t('secondSubtitle')}
                    </h3>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <Link 
                        href="#about"
                        className="inline-flex justify-center items-center h-12 px-6 bg-[#907C33] text-white rounded-md hover:bg-[#907C33]/90 transition-colors"
                        aria-label={t('seeMore')}
                    >
                        {t('seeMore')}
                    </Link>
                    <Link 
                        href="#video"
                        onClick={openVideoModal}
                        className="inline-flex justify-center items-center h-12 px-6 bg-transparent text-white border border-[#907C33] rounded-md hover:bg-[#907C33]/10 transition-colors"
                        aria-label={t('video')}
                    >
                        {t('video')}
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