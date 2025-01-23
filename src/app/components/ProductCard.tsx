'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product.types';

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
          className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary"
          onClick={handleClick}
        >
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">€{product.price}</span>
          {showAddToCart && (
            product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t('shop.addToCart')}
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
