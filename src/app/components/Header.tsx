'use client';

import { useTranslations } from 'next-intl';
import ReusableModal from './Modal';
import { useState } from 'react';
import { Link } from '@/i18n/routing';

const Header = () => {

    const t = useTranslations('header');
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const openVideoModal = () => setIsVideoOpen(true);
    const closeVideoModal = () => setIsVideoOpen(false);

    return (
        <header
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-01.png')" }}
        >

            <div className="container mx-auto h-full flex items-center py-4">
                <div
                className="text-left animate-zoomIn"
                >
                <h1 className="text-6xl font-bold text-white font-[Poppins]" itemProp="name">
                    {t('title')}
                </h1>
                <h2 className="text-2xl text-white font-[Poppins] mt-4" itemProp="description">
                    {t('subtitle')}
                </h2>
                {/* Product categories as h3 for SEO */}
                <h3 className="text-lg text-white font-[Poppins] mt-4" itemProp="offers">
                    {t('secondSubtitle')}
                </h3>

                <div className="mt-6 flex space-x-4">
                    <Link href="#about" className="scroll-smooth">
                        <button 
                        style={{ width: '170px' }}
                        className="bg-[#907C33] text-white py-2 px-4 rounded-md hover:bg-transparent hover:border hover:border-[#907C33] transition-all duration-300">
                            {t('seeMore')}
                        </button>
                    </Link>
                    <Link href="#video" className="scroll-smooth">
                        <button 
                            onClick={openVideoModal}
                            style={{ width: '170px' }}
                            className="bg-transparent text-white border border-[#907C33] py-2 px-4 rounded-md hover:bg-[#907C33] transition-all duration-300">
                            {t('video')}
                        </button>
                    </Link>
                </div>
                </div>
            </div>

            <ReusableModal 
                isOpen={isVideoOpen}
                onClose={closeVideoModal}>
                <div className="relative w-full h-[400px]">
                    <iframe
                        id="video"
                        src={'video.mp4'}
                        title={'Video Modal'}
                        className="absolute top-0 left-0 w-full h-full rounded-md"
                        allowFullScreen
                    ></iframe>
                </div>
            </ReusableModal>
        </header>
    );
};

export default Header;
