'use client';

import HeaderContentText from './HeaderContentText';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden">
      {/* Static Background First */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <Image
          src="/images/header.webp"
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          priority
          fill
          sizes="100vw"
        />
      </div>
      
      {/* Deferred Video Load */}
      <div className="absolute inset-0 w-full h-full">
        {typeof window !== 'undefined' && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://glaukthaqi.com/header-video.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Foreground Content */}
      <HeaderContentText />

    </header>
  );
};

export default Header;
