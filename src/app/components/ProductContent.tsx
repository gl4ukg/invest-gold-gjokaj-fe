"use server";

import React from "react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Product } from "@/app/types/product.types";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "@/app/components/ProductCard";
import { ProductGallery } from "./ProductGallery";
import ClientAddToCartButton from "./ClientAddToCartButton";

export default async function ProductContent({
  id,
  product,
  related,
  tNs,
  locale,
}: {
  id: string;
  product: Product;
  related: Product[];
  tNs: (key: string) => string;
  locale: string;
}) {
  const t = tNs;

  const ringsText: { [key: string]: string } = {
    "Ari i Verdhë": t("rings.yellowGold"),
    "Ari i Bardhë": t("rings.whiteGold"),
    "Ari Rozë": t("rings.roseGold"),
    "Ari Dy-ngjyrësh": t("rings.twoColorGold"),
    "Ari Shumëngjyrësh": t("rings.multiColorGold"),
  };

  const productDescriptionParsed = (() => {
    try {
      if (typeof product?.description === 'string') {
        if (product.description === '') {
          return { en: '', de: '', sq: '' };
        }
        return JSON.parse(product.description);
      }
      return product.description || { en: '', de: '', sq: '' };
    } catch (error) {
      console.error('Error parsing product description:', error);
      return { en: '', de: '', sq: '' };
    }
  })();

  return (
    <div className="container mx-auto px-4 py-32">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <ProductGallery
          images={
            product?.images?.length
              ? product.images
              : ["/images/placeholder.jpg"]
          }
          className="w-full"
        />

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-darkGray">
            Unaza: {product.name}
          </h1>

          <div className="text-2xl font-bold text-primary">
            {product.weight} gram
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-darkGray">
              {t('product.description')}
            </h2>
            <p className="text-lightGray">{productDescriptionParsed[locale as 'en' | 'de' | 'sq']}</p>
          </div>

          <div>
            <h2 className="text-xl text-darkGray font-semibold mb-2">
              {t("product.specifications")}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-lightGray py-2 border-b">
                <span className="font-medium">{t("product.category")}</span>
                <span>{ringsText[product.category.name]}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-lightGray">
                <span className="font-medium text-lightGray">
                  {t("product.stock")}
                </span>
                <span
                  className={
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.stock > 0
                    ? t("product.inStock")
                    : t("product.outOfStock")}
                </span>
              </div>
            </div>
          </div>

          {product.stock > 0 && (
            <ClientAddToCartButton
              product={product}
              label={t("product.addToCart")}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-darkGray">
            {t("product.relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related?.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
