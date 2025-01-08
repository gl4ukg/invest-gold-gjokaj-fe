import React from 'react';
import { FaMinus } from 'react-icons/fa'; 

interface ServiceItem {
  id: number;
  name: string;
}

const services: ServiceItem[] = [
  { id: 1, name: 'Prodhim' },
  { id: 2, name: 'Rafinim' },
  { id: 3, name: 'Analiz XRA' },
  { id: 4, name: 'Eksport' },
  { id: 5, name: 'Import' },
  { id: 6, name: 'Përpunim' },
  { id: 7, name: 'Riparim' },
];

const ServiceListItem: React.FC<{ name: string }> = ({ name }) => (
  <li className="flex text-lg text-gray hover:text-primary items-center">
    <FaMinus className="mr-2" /> {name}
  </li>
);

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="bg-[url('/images/cover2-01.png')] bg-cover bg-center bg-no-repeat py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl text-primary mb-2">Shërbimet</h1>
            <ul className="text-lg pl-10 md:text-xl font-medium">
              {services.map((service) => (
                <ServiceListItem key={service.id} name={service.name} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
