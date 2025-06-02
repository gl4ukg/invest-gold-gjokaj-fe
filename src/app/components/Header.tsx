'use client';

import { useTranslations } from 'next-intl';
import ReusableModal from './Modal';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Header = () => {

    const t = useTranslations('header');
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
        <header className="relative w-full h-screen overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/header.png"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://glaukthaqi.com/header-video.mp4" type="video/mp4" />
                </video>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40">
                    {/* <Image
                        src="/images/header.png"
                        alt="Header Image"
                        fill
                        className="object-cover"
                    /> */}
                </div>
            </div>

            <div className="container mx-auto px-4 h-full flex items-center py-4 relative z-10">
                <div
                className="text-left animate-zoomIn"
                >
                <motion.h1 
                    className="md:text-6xl text-5xl font-bold text-white font-[Poppins]" 
                    itemProp="name"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {t('title')}
                </motion.h1>
                <motion.h2 
                    className="md:text-2xl text-lg font-[Poppins] mt-4" 
                    itemProp="description"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                >
                    {t('subtitle')}
                </motion.h2>
                {/* Product categories as h3 for SEO */}
                <motion.h3 
                    className="md:text-lg text-base font-[Poppins] mt-4" 
                    itemProp="offers"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                >
                    {t('secondSubtitle')}
                </motion.h3>

                <motion.div
                    className="mt-6 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
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
                </motion.div>
                </div>
            </div>

            <ReusableModal 
                isOpen={isVideoOpen}
                onClose={closeVideoModal}>
                <div className="relative w-full h-[400px]">
                    <iframe
                        id="video"
                        src={'https://glaukthaqi.com/header-video.mp4'}
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
