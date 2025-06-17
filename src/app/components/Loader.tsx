import React, { useRef } from 'react';

interface LoaderProps {
    loaderRef?: React.RefObject<HTMLDivElement | null>;
}

const Loader: React.FC<LoaderProps> = ({ loaderRef }) => {
    return (
        <div 
            ref={loaderRef}
            className="flex justify-center items-center"
        >
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#907C33] border-opacity-20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-[#907C33] border-t-transparent animate-spin rounded-full absolute left-0 top-0">
                </div>
            </div>
        </div>
    );
};

export default Loader;
