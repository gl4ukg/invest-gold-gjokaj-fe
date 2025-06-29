'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product.types';
import { FaCartShopping } from 'react-icons/fa6';


interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const router = useRouter();
  const t = useTranslations();
  const { addToCart } = useCart();

  const handleClick = () => {
    router.push(`/unaza/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-full">
      <div 
        className="relative h-32 md:h-64 cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={product.images?.[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 
          className="text-lg font-semibold mb-2 cursor-pointer text-darkGray"
          onClick={handleClick}
        >
          {product.name}
        </h3>
        {/* <h6
          className="text-base font-normal mb-2 cursor-pointer text-darkGray"
          onClick={handleClick}
        >
          <p className="truncate">{product.description}</p>
        </h6> */}
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-lg font-bold text-lightGray">{product.weight} gram</span>
          {showAddToCart && (
            product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white p-2 md:px-4 md:py-2 rounded-lg "
                aria-label={t('product.addToCart')}
              >
                <FaCartShopping className='text-white text-sm md:text-lg' />
              </button>
            ) : (
              <span className="text-primary">{t('shop.outOfStock')}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
