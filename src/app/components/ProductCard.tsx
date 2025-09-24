"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "../context/CartContext";
import { FaCartShopping } from "react-icons/fa6";
import { Product } from "../types/product.types";
import type { ReactNode } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductJsonLd = ({ product, href }: { product: Product; href: string }) => {
  const locale = useLocale();
  
  // Create a stable JSON string with sorted keys and consistent formatting
  const jsonString = JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'JewelryProduct',
    brand: {
      '@type': 'Brand',
      name: 'Invest Gold Gjokaj'
    },
    description: `${product.category?.name === 'Fejese' ? 'Unazë Fejese' : 'Unazë Martese'} ${product.name} në Gjakovë. Rrathe ${product.category?.name === 'Fejese' ? 'Fejese' : 'Martese'} të punuara me mjeshtëri nga ari. ${product.weight}g.`,
    image: product.images?.[0] || '/images/placeholder.jpg',
    name: product.name,
    offers: {
      '@type': 'Offer',
      availability: product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: product.price,
      priceCurrency: 'EUR',
      url: `https://investgoldgjokaj.com/${locale}${href}`
    },
    sku: product.numericId || product.id
  }, null, 2);

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
};

export default function ProductCard({ product }: ProductCardProps): ReactNode {
  const href = product.numericId ? `/unaza/${product.numericId}` : `/unaza/${product.id}`;
  const t = useTranslations();
  const locale = useLocale()
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <>
      <ProductJsonLd product={product} href={href} />
      <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-full">
        <Link
          href={href}
          aria-label={`Unaza: ${product.name}, ${product.category?.name}`}
        >
          <figure className="relative h-32 md:h-64">
            <Image
              src={product.images?.[0] || "/images/placeholder.jpg"}
              alt={`Unazë ${product.category?.name === 'Fejese' ? 'Fejese' : 'Martese'} ${product.name} në Gjakovë${product.weight ? `, ${product.weight}g` : ''} | Invest Gold Gjokaj`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          </figure>
        </Link>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-0 text-darkGray">
            <Link href={href} className="hover:underline">
              {product.category?.name === 'Fejese' ? 'Unazë Fejese' : 'Unazë Martese'}: {product.name} | Rrathe {product.category?.name === 'Fejese' ? 'Fejese' : 'Martese'} në Gjakovë
            </Link>
          </h3>

          {product.category?.name && (
            <p className="text-xs text-lightGray mb-2">{product.category.name}</p>
          )}

          <div className="flex justify-between items-center">
            {product.weight ? (
              <span className="text-sm md:text-lg font-bold text-lightGray">
                {product.weight} g
              </span>
            ) : (
              <span />
            )}

            {product.stock && product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white p-2 md:px-4 md:py-2 rounded-lg "
                aria-label={t("product.addToCart")}
              >
                <FaCartShopping className="text-white text-sm md:text-lg" />
              </button>
            ) : (
              <span className="text-primary">{t('shop.outOfStock')}</span>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
