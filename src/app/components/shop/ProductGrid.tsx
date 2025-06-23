"use client";

import React from 'react';
import { useTranslations } from "next-intl";
import { Product } from "@/app/types/product.types";
import ProductCard from "@/app/components/ProductCard";
import Loader from "@/app/components/Loader";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

export default function ProductGrid({
  products,
  loading,
  error,
  hasMore,
  loaderRef,
}: ProductGridProps) {
  const t = useTranslations();

  if (loading && products.length === 0) {
    return <Loader loaderRef={loaderRef} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-darkGray">{t("shop.noProducts")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && <Loader loaderRef={loaderRef} />}
    </>
  );
}
