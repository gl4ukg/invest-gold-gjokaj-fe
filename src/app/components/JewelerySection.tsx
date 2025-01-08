import React from 'react';

const JewelrySection: React.FC = () => {
  return (
    <div>
        <section
        id="jewelry"
        className="bg-[url('/images/cover-01.png')] bg-cover bg-center bg-no-repeat py-24"
        >
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-start">
                <div
                    className="w-full md:w-7/12 animate-slideInRight"
                    style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}
                >
                    <p className="text-[#907C33] font-medium italic text-3xl md:text-4xl">
                    We offer our clients the opportunity to discover the unique,
                    elegant, and precious world of jewelry.
                    </p>
                </div>
                </div>
            </div>
        </section>
        <section className="bg-white py-32 jewelryTwo">
            <div className="container mx-auto px-4">
                <p className="text-center text-primary text-5xl">Bizhuteri</p>
                <p className='text-center text-tertiary text-2xl mt-8'>Nuk janë të disponueshme për momentin</p>
            </div>
        </section>
    </div>
  );
};

export default JewelrySection;
