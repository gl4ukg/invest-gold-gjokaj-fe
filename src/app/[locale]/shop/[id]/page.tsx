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
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string; id: string }
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const locale = await params?.locale || 'sq';
//   const t = await getTranslations({ locale, namespace: 'metadata' });
//   const productId = params.id;

//   try {
//     // Fetch the specific product data
//     const product = await ProductsService.getById(productId);

//     if (!product) {
//       throw new Error('Product not found');
//     }

//     const metadata: Metadata = {
//       title: `${product.name} - ${t('product.title')}`,
//       description: product.description || t('product.description'),
//       keywords: `${t('product.keywords')}, ${product.name}, ${product.category?.name || ''}`,
//       openGraph: {
//         title: `${product.name} - ${t('product.ogTitle')}`,
//         description: product.description || t('product.ogDescription'),
//         images: [
//           {
//             url: product.image || '/images/product-og-image.jpg',
//             width: 1200,
//             height: 630,
//             alt: `${product.name} - ${t('product.ogImageAlt')}`,
//           },
//         ],
//         locale,
//         type: 'website',
//         siteName: 'Invest Gold Gjokaj - Product',
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: `${product.name} - ${t('product.twitterTitle')}`,
//         description: product.description || t('product.twitterDescription'),
//         images: [product.image || '/images/product-og-image.jpg'],
//       },
//       alternates: {
//         canonical: new URL(`/${locale}/shop/${productId}`, 'https://investgoldgjokaj.com').toString(),
//         languages: {
//           'en': `/en/shop/${productId}`,
//           'de': `/de/shop/${productId}`,
//           'sq': `/sq/shop/${productId}`,
//         },
//       },
//     };

//     return metadata;
//   } catch (error) {
//     // Return a 404 metadata if product is not found
//     return {
//       title: t('product.notFound'),
//       description: t('product.notFoundDescription'),
//       robots: {
//         index: false,
//         follow: false,
//       },
//     };
//   }
// }

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
        if (productData.category.id) {
          const related = await ProductsService.search({
            categoryId: productData.category.id,
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
      addToCart(product, quantity );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-darkGray">{t('product.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container h-screen mx-auto px-4 flex items-center justify-center">
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
    <div className="container mx-auto px-4 py-32">
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
          <h1 className="text-3xl font-bold text-darkGray">{product.name}</h1>
          
          <div className="text-2xl font-bold text-primary">
            {product.weight} gr.
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-darkGray">
              {t('product.description')}
            </h2>
            <p className="text-lightGray">{product.description}</p>
          </div>

          <div>
            <h2 className="text-xl text-darkGray font-semibold mb-2">
              {t('product.specifications')}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-lightGray py-2 border-b">
                <span className="font-medium">{t('product.category')}</span>
                <span>{product.category.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-lightGray">
                <span className="font-medium text-lightGray">{t('product.stock')}</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                </span>
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
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
          <h2 className="text-2xl font-bold mb-6 text-darkGray">
            {t('product.relatedProducts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts?.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
