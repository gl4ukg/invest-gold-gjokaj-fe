'use client';

import HeaderContentText from './HeaderContentText';
import Image from 'next/image';
import { useState, useRef } from 'react';
import Loader from './Loader';

const Header = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setIsLoading(false);
  };

  return (
    <header className="relative w-full h-screen overflow-hidden bg-black">
      {/* Static Background with priority loading */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-60'}`}>
        <div className="relative w-full h-full">
          <Image
            src="/images/header.webp"
            alt="Header background"
            className="object-cover"
            priority
            quality={75}
            fill
            sizes="100vw"
            loading="eager"
          />
        </div>
      </div>
      
      {/* Deferred Video Load */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        {typeof window !== 'undefined' && (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-60' : 'opacity-0'}`}
              onLoadedData={handleVideoLoad}
            >
              <source src="https://glaukthaqi.com/header-video.mp4" type="video/mp4" />
            </video>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader loaderRef={loaderRef} />
              </div>
            )}
          </>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Foreground Content */}
      <HeaderContentText />

    </header>
  );
};

export default Header;
