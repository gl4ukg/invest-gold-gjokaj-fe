'use client';

import loadable from '@loadable/component';
const HeaderContentText = loadable(() => import("./HeaderContentText"));

const Header = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/header.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://glaukthaqi.com/header-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Foreground Content */}
      <HeaderContentText />

    </header>
  );
};

export default Header;
