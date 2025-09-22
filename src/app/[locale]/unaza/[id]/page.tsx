import React, { useEffect } from "react";
import ProductsService from "@/app/services/products";
import ProductJsonLd from "@/app/components/JsonLd/ProductJsonLd";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductContent from "@/app/components/ProductContent";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  try {
    // Fetch the specific product data
    const product = await ProductsService.getById(id);

    if (!product) {
      notFound();
    }

    const metadata: Metadata = {
      title: `${product.name} - ${t("product.title")}`,
      description: product.name || "",
      keywords: `${t("product.keywords")}, ${product.name}, ${
        product.category?.name || ""
      }`,
      openGraph: {
        title: `${product.name} - ${t("product.ogTitle")}`,
        description: product.name || "",
        images: [
          {
            url: product.images?.[0] || "/images/um6.png",
            width: 1200,
            height: 630,
            alt: `${product.name} - ${t("product.ogImageAlt")}`,
          },
        ],
        locale,
        type: "website",
        siteName: "Invest Gold Gjokaj - Product",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - ${t("product.twitterTitle")}`,
        description: product.name || "",
        images: [product.images?.[0] || "/images/um6.png"],
      },
      alternates: {
        canonical: new URL(
          `/${locale}/unaza/${id}`,
          "https://investgoldgjokaj.com"
        ).toString(),
        languages: {
          en: `/en/unaza/${id}`,
          de: `/de/unaza/${id}`,
          sq: `/sq/unaza/${id}`,
        },
      },
    };

    return metadata;
  } catch (error) {
    notFound();
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();

  try {
    const product = await ProductsService.getById(id);
    const related = await ProductsService.search({
      categoryIds: [product.category.id ?? ""],
      page: 1,
      limit: 4,
    });
    const relatedItems = related.items.filter((p) => p.id !== product.id);

    if (!product) {
      notFound();
    }

    return (
      <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
        <ProductJsonLd product={product} />
        <ProductContent
          tNs={t}
          related={relatedItems}
          product={product}
          id={id}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
