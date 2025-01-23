'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import ProductsService from '@/app/services/products';
import { Product } from '@/app/types/product.types';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import {  useRouter } from '@/i18n/routing';
import ProductCard from '@/app/components/ProductCard';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await ProductsService.getById(params.id as string);
        setProduct(productData);

        // Fetch related products from the same category
        if (productData.categoryId) {
          const related = await ProductsService.search({
            categoryId: productData.categoryId,
            page: 1,
            limit: 4,
          });
          setRelatedProducts(
            related.products.filter((p) => p.id !== productData.id)
          );
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(
          err instanceof Error ? err.message : t('product.error')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, t]);

  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock));
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-gray-600">{t('product.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || t('product.notFound')}
          </h1>
          <button
            onClick={() => router.push('/shop')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            {t('product.backToShop')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
          <Image
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="text-2xl font-bold text-primary">
            €{product.price}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t('product.description')}
            </h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t('product.specifications')}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t('product.category')}</span>
                <span>{product.categoryId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t('product.stock')}</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                </span>
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{t('product.quantity')}:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>{t('product.addToCart')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {t('product.relatedProducts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                showAddToCart={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
