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
    router.push(`/shop/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div 
        className="relative h-64 cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={product.image || '/images/placeholder.jpg'}
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
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-lightGray">€{product.price}</span>
          {showAddToCart && (
            product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white px-4 py-2 rounded-lg "
              >
                <FaCartShopping className='text-white' />
              </button>
            ) : (
              <span className="text-red-500">{t('shop.outOfStock')}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
