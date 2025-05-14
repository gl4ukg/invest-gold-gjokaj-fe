import React from 'react';
import ProductsService from '@/app/services/products';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProductContent from '@/app/components/ProductContent';


export async function generateMetadata(params: Promise<{ locale: string; id: string }>): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  try {
    // Fetch the specific product data
    const product = await ProductsService.getById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    const metadata: Metadata = {
      title: `${product.name} - ${t('product.title')}`,
      description: product.description || t('product.description'),
      keywords: `${t('product.keywords')}, ${product.name}, ${product.category?.name || ''}`,
      openGraph: {
        title: `${product.name} - ${t('product.ogTitle')}`,
        description: product.description || t('product.ogDescription'),
        images: [
          {
            url: product.images?.[0] || '/images/product-og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${product.name} - ${t('product.ogImageAlt')}`,
          },
        ],
        locale,
        type: 'website',
        siteName: 'Invest Gold Gjokaj - Product',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${t('product.twitterTitle')}`,
        description: product.description || t('product.twitterDescription'),
        images: [product.images?.[0] || '/images/product-og-image.jpg'],
      },
      alternates: {
        canonical: new URL(`/${locale}/shop/${id}`, 'https://investgoldgjokaj.com').toString(),
        languages: {
          'en': `/en/shop/${id}`,
          'de': `/de/shop/${id}`,
          'sq': `/sq/shop/${id}`,
        },
      },
    };

    return metadata;
  } catch (error) {
    // Return a 404 metadata if product is not found
    return {
      title: t('product.notFound'),
      description: t('product.notFoundDescription'),
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function ProductDetail({ params }: { params: { id: string } }) {

  return (
    <ProductContent id={params.id} />
  );
}
