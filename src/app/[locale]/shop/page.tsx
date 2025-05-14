import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CategoriesService from "@/app/services/categories";
import dynamic from "next/dynamic";

const ShopContent = dynamic(() => import("@/app/components/ShopContent"), {
  ssr: true,
});

type Props = {
  params: Promise<{ locale: string }>;
};
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  try {
    // Fetch categories for dynamic metadata
    const categories = await CategoriesService.getAll();
    const categoryNames = categories.map((cat) => cat.name).join(", ");

    const metadata: Metadata = {
      title: t("shop.title"),
      description: `${t("shop.description")} ${t(
        "shop.featuring"
      )} ${categoryNames}`,
      keywords: `${t("shop.keywords")}, ${categoryNames}`,
      openGraph: {
        title: t("shop.ogTitle"),
        description: `${t("shop.ogDescription")} ${t(
          "shop.featuring"
        )} ${categoryNames}`,
        images: [
          {
            url: "/images/shop-og-image.jpg",
            width: 1200,
            height: 630,
            alt: t("shop.ogImageAlt"),
          },
        ],
        locale,
        type: "website",
        siteName: "Invest Gold Gjokaj - Shop",
      },
      twitter: {
        card: "summary_large_image",
        title: t("shop.twitterTitle"),
        description: `${t("shop.twitterDescription")} ${t(
          "shop.featuring"
        )} ${categoryNames}`,
        images: ["/images/shop-og-image.jpg"],
      },
      alternates: {
        canonical: new URL(
          `/${locale}/shop`,
          "https://investgoldgjokaj.com"
        ).toString(),
        languages: {
          en: "/en/shop",
          de: "/de/shop",
          sq: "/sq/shop",
        },
      },
    };

    return metadata;
  } catch (error) {
    // Fallback metadata if categories fetch fails
    return {
      title: t("shop.title"),
      description: t("shop.description"),
      keywords: t("shop.keywords"),
      openGraph: {
        title: t("shop.ogTitle"),
        description: t("shop.ogDescription"),
        images: [
          {
            url: "/images/shop-og-image.jpg",
            width: 1200,
            height: 630,
            alt: t("shop.ogImageAlt"),
          },
        ],
        locale,
        type: "website",
        siteName: "Invest Gold Gjokaj - Shop",
      },
      twitter: {
        card: "summary_large_image",
        title: t("shop.twitterTitle"),
        description: t("shop.twitterDescription"),
        images: ["/images/shop-og-image.jpg"],
      },
      alternates: {
        canonical: new URL(
          `/${locale}/shop`,
          "https://investgoldgjokaj.com"
        ).toString(),
        languages: {
          en: "/en/shop",
          de: "/de/shop",
          sq: "/sq/shop",
        },
      },
    };
  }
}

export default function Shop() {
  return <ShopContent />;
}
