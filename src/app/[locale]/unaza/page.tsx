import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import CategoriesService from "@/app/services/categories";
import ProductsService from "@/app/services/products";
import ShopContent from "@/app/components/ShopContent";


type Props = { params: Promise<{ locale: string }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  try {
    const categories = await CategoriesService.getAll();
    const categoryNames = categories.map((c) => c.name).join(", ");

    const firstImage = categories.find((c) => !!c.image)?.image ?? "/images/um6.png";

    return {
      title: t("shop.title"),
      description: `${t("shop.description")} ${t("shop.featuring")} ${categoryNames}`,
      keywords: `${t("shop.keywords")}, ${categoryNames}, 'unaza ari','unaza qafe','bizhuteri ari','invest gold gjokaj','rrathe fejese','rrathe martese'`,
      openGraph: {
        title: t("shop.ogTitle"),
        description: `${t("shop.ogDescription")} ${t("shop.featuring")} ${categoryNames}`,
        images: [{ url: String(firstImage), width: 1200, height: 630, alt: t("shop.ogImageAlt") }],
        locale,
        type: "website",
        siteName: "Invest Gold Gjokaj - Shop",
      },
      twitter: {
        card: "summary_large_image",
        title: t("shop.twitterTitle"),
        description: `${t("shop.twitterDescription")} ${t("shop.featuring")} ${categoryNames}`,
        images: [String(firstImage)],
      },
      alternates: {
        canonical: new URL(`/${locale}/unaza`, "https://investgoldgjokaj.com").toString(),
        languages: { en: "/en/unaza", de: "/de/unaza", sq: "/sq/unaza" },
      },
    };
  } catch {
    return {
      title: t("shop.title"),
      description: t("shop.description"),
      keywords: t("shop.keywords"),
      openGraph: {
        title: t("shop.ogTitle"),
        description: t("shop.ogDescription"),
        images: [{ url: "/images/um6.png", width: 1200, height: 630, alt: t("shop.ogImageAlt") }],
        locale,
        type: "website",
        siteName: "Invest Gold Gjokaj - Shop",
      },
      twitter: {
        card: "summary_large_image",
        title: t("shop.twitterTitle"),
        description: t("shop.twitterDescription"),
        images: ["/images/um6.png"],
      },
      alternates: {
        canonical: new URL(`/${locale}/unaza`, "https://investgoldgjokaj.com").toString(),
        languages: { en: "/en/unaza", de: "/de/unaza", sq: "/sq/unaza" },
      },
    };
  }
}

export default async function Shop({ params }: Props) {
  const { locale } = await params;
  if (!["en", "de", "sq"].includes(locale)) notFound();

  // === SSR: categories + initial product page ===
  const categories = await CategoriesService.getAll();
  if (!categories?.length) notFound();

  const ITEMS_PER_PAGE = 9;

  // Initial state: no filters, no search, all categories (or choose first)
  const initialSelectedCategoryIds: string[] = []; // or [categories[0].id]
  const initialSortOrder: "ASC" | "DESC" = "DESC";
  const initialPage = 1;

  const initialSearch = await ProductsService.search({
    query: "",
    categoryIds: initialSelectedCategoryIds,
    page: initialPage,
    limit: ITEMS_PER_PAGE,
    sortOrder: initialSortOrder,
  });

  const initialProducts = initialSearch?.items ?? [];
  const initialTotalPages = initialSearch?.meta?.totalPages ?? 1;

  return (
    <ShopContent
      locale={locale}
      initialCategories={categories}
      initialProducts={initialProducts}
      initialSelectedCategoryIds={initialSelectedCategoryIds}
      initialSortOrder={initialSortOrder}
      initialPage={initialPage}
      itemsPerPage={ITEMS_PER_PAGE}
      initialTotalPages={initialTotalPages}
    />
  );
}
