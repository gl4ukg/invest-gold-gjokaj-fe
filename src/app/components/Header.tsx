'use client';

import { useTranslations } from 'next-intl';
import ReusableModal from './Modal';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

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
        <header
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-01.png')" }}
        >

            <div className="container mx-auto h-full flex items-center py-4">
                <div
                className="text-left animate-zoomIn"
                >
                <motion.h1 
                    className="text-6xl font-bold text-white font-[Poppins]" 
                    itemProp="name"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {t('title')}
                </motion.h1>
                <motion.h2 
                    className="text-2xl text-white font-[Poppins] mt-4" 
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
                    className="text-lg text-white font-[Poppins] mt-4" 
                    itemProp="offers"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                >
                    {t('secondSubtitle')}
                </motion.h3>

                <motion.div
                    className="mt-6 flex space-x-4"
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
