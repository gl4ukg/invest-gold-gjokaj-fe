'use client';

import { useTranslations } from 'next-intl';
import ReusableModal from './Modal';
import Navbar from './Navbar';
import { useState } from 'react';

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
            <Navbar />

            <div className="container mx-auto h-full flex items-center">
                <div
                className="text-left animate-zoomIn"
                style={{ width: '32%', position: 'absolute', top: '45%' }}
                >
                <h1 className="text-white text-5xl font-bold font-[Poppins]">{t('title')}</h1>
                <p className="text-white text-lg font-[Poppins] mt-4">
                    {t('subtitle')}
                </p>

                <div className="mt-6 flex space-x-4">
                    <a href="#about" className="scroll-smooth">
                    <button
                        style={{ width: '170px' }}
                        className="bg-[#907C33] text-white py-2 px-4 rounded-md hover:bg-transparent hover:border hover:border-[#907C33] transition-all duration-300"
                    >
                        {t('seeMore')}
                    </button>
                    </a>
                    <button
                    onClick={openVideoModal}
                    style={{ width: '170px' }}
                    className="bg-transparent text-white border border-[#907C33] py-2 px-4 rounded-md hover:bg-[#907C33] transition-all duration-300"
                    >
                    {t('video')}
                    </button>
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
