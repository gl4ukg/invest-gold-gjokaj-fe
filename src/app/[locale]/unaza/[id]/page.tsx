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

    const category = product?.category?.name || '';
    const isEngagement = category.toLowerCase().includes('fejese');
    const isWedding = category.toLowerCase().includes('martese');
    
    const title = `${isEngagement ? 'Unazë Fejese' : 'Unazë Martese'} ${product?.name} në Gjakovë | Invest Gold Gjokaj`;
    const description = `${isEngagement ? 'Unazë Fejese' : 'Unazë Martese'} ${product?.name} e punuar me mjeshtëri në Gjakovë. ${product?.weight}g ar. Dizajn unik për momentin tuaj të veçantë.`;
    const keywords = `${isEngagement ? 'unaza fejese, rrathe fejese' : 'unaza martese, rrathe martese'}, ${product?.name}, unaza ari gjakove, stoli martese gjakove`;

    return {
      metadataBase: new URL('https://investgoldgjokaj.com'),
      title,
      description,
      keywords,
      applicationName: 'Invest Gold Gjokaj',
      category: 'Shopping',
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      },
      other: {
        'fb:app_id': 'your-fb-app-id',
        'og:type': 'product',
        'og:price:amount': product?.price?.toString() || '',
        'og:price:currency': 'EUR',
        'og:availability': product?.stock && product?.stock > 0 ? 'instock' : 'outofstock',
        'product:brand': 'Invest Gold Gjokaj',
        'product:category': category || '',
        'geo.region': 'XK-Đakovica',
        'geo.placename': 'Gjakovë',
        'geo.position': '42.3833;20.4333',
        'ICBM': '42.3833, 20.4333',
        'twitter:label1': 'Pesha',
        'twitter:data1': `${product?.weight || ''}g`,
        'twitter:label2': 'Kategoria',
        'twitter:data2': product?.category?.name || ''
      },  
      openGraph: {
        title,
        description,
        images: [{ url: String(product?.images?.[0] || '/images/placeholder.jpg'), width: 1200, height: 630, alt: `${isEngagement ? 'Unazë Fejese' : 'Unazë Martese'} ${product?.name} në Gjakovë` }],
        locale,
        type: 'website',
        siteName: 'Invest Gold Gjokaj'
        // Note: OpenGraph doesn't support price directly, it's handled via product meta tags
      },
      twitter: {
        card: 'summary_large_image',
        title: `${isEngagement ? 'Unazë Fejese' : 'Unazë Martese'} ${product.name} në Gjakovë | Invest Gold Gjokaj`,
        description: `${isEngagement ? 'Unazë Fejese' : 'Unazë Martese'} ${product.name} e punuar me mjeshtëri. ${product.weight}g ar. Dizajn unik për momentin tuaj të veçantë.`,
        images: [product.images?.[0] || '/images/um6.png'],
        creator: '@investgoldgjokaj',
        site: '@investgoldgjokaj',
      },
      alternates: {
        canonical: `https://investgoldgjokaj.com/${locale}/unaza/${id}`,
        languages: {
          en: `https://investgoldgjokaj.com/en/unaza/${id}`,
          de: `https://investgoldgjokaj.com/de/unaza/${id}`,
          sq: `https://investgoldgjokaj.com/sq/unaza/${id}`
        }
      }
    };
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
          locale={locale}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
