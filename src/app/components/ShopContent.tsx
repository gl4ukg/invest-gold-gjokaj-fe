"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import ProductsService from "@/app/services/products";
import { Product } from "@/app/types/product.types";
import { Category } from "@/app/types/category.types";
import { FaFilter } from "react-icons/fa";
import { debounce } from "lodash";
import ProductCard from "@/app/components/ProductCard";
import Loader from "@/app/components/Loader";

type SortOrder = "ASC" | "DESC";

interface Props {
  locale: string;
  initialCategories: Category[];
  initialProducts: Product[];
  initialSelectedCategoryIds: string[];
  initialSortOrder: SortOrder;
  initialPage: number;
  itemsPerPage: number;
  initialTotalPages: number;
}

export default function ShopContent({
  locale,
  initialCategories,
  initialProducts,
  initialSelectedCategoryIds,
  initialSortOrder,
  initialPage,
  itemsPerPage,
  initialTotalPages,
}: Props) {
  const t = useTranslations();

  // Hydrate with SSR data
  const [categories] = useState<Category[]>(initialCategories);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(initialSelectedCategoryIds);
  const [filters, setFilters] = useState<{ sortOrder: SortOrder }>({ sortOrder: initialSortOrder });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [hasMore, setHasMore] = useState<boolean>(initialPage < initialTotalPages);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  const searchProducts = async (params: {
    query?: string;
    categoryIds: string[];
    sortOrder: SortOrder;
    page: number;
    loadMore?: boolean;
  }) => {
    const { query = "", categoryIds, sortOrder, page, loadMore } = params;

    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await ProductsService.search({
        query,
        categoryIds,
        page,
        limit: itemsPerPage,
        sortOrder,
      });

      const items = response?.items ?? [];
      const total = response?.meta?.totalPages ?? 1;

      if (loadMore) {
        setAllProducts((prev) => [...prev, ...items]);
      } else {
        setAllProducts(items);
      }

      setTotalPages(total);
      setHasMore(page < total);
      setError(null);
    } catch (err) {
      console.error("Failed to search products:", err);
      setError(t("shop.errorLoadingProducts") || "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Debounced search (does not run on first paint)
  const debouncedSearch = useCallback(
    debounce((q: string, categoryIds: string[], sortOrder: SortOrder) => {
      setCurrentPage(1);
      searchProducts({ query: q, categoryIds, sortOrder, page: 1 });
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm, selectedCategory, filters.sortOrder);
  };

  // Handle sort change
  const handleFilterChange = (newFilters: Partial<{ sortOrder: SortOrder }>) => {
    const next = { ...filters, ...newFilters };
    setFilters(next);
    setCurrentPage(1);
    setHasMore(true);
    searchProducts({
      query: searchTerm,
      categoryIds: selectedCategory,
      sortOrder: next.sortOrder,
      page: 1,
    });
  };

  // Handle category toggle
  const handleCategoryChange = (categoryId: string) => {
    const newSelection = selectedCategory.includes(categoryId)
      ? selectedCategory.filter((id) => id !== categoryId)
      : [...selectedCategory, categoryId];

    setSelectedCategory(newSelection);
    setCurrentPage(1);
    setHasMore(true);

    searchProducts({
      query: searchTerm,
      categoryIds: newSelection,
      sortOrder: filters.sortOrder,
      page: 1,
    });
  };

  // Infinite load more
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchProducts({
      query: searchTerm,
      categoryIds: selectedCategory,
      sortOrder: filters.sortOrder,
      page: nextPage,
      loadMore: true,
    });
  };

  // Intersection Observer
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [hasMore, loadingMore, loading, currentPage]);

  // Map localized category names
  const ringsText: Record<string, string> = {
    "Ari i Verdhë": t("rings.yellowGold"),
    "Ari i Bardhë": t("rings.whiteGold"),
    "Ari Rozë": t("rings.roseGold"),
    "Ari Dy-ngjyrësh": t("rings.twoColorGold"),
    "Ari Shumëngjyrësh": t("rings.multiColorGold"),
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filters Button */}
        <button
          className="lg:hidden flex items-center gap-2 text-primary"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <FaFilter /> {t("shop.filters")}
        </button>

        {/* Filters Sidebar */}
        <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-gray rounded-lg shadow-lg p-6 sticky top-4">
            {/* Search */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-darkGray">{t("shop.search")}</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("shop.searchPlaceholder")}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightGray"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-darkGray">{t("shop.categories")}</h3>
              <div className="space-y-3">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      selectedCategory.includes(category.id!)
                        ? "bg-primary/10 shadow-md"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-6 h-6">
                        <input
                          type="checkbox"
                          name="category"
                          checked={selectedCategory.includes(category.id!)}
                          onChange={() => handleCategoryChange(category.id!)}
                          className="appearance-none w-4 h-4 rounded border-2 border-darkGray 
                                     checked:border-primary checked:bg-primary checked:border-0
                                     transition-all duration-200 cursor-pointer 
                                     focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div
                          className={`absolute inset-0 rounded transition-transform duration-200 
                                      ${selectedCategory.includes(category.id!) ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                        >
                          <div className="absolute inset-0 rounded bg-primary/10 animate-pulse"></div>
                        </div>
                      </div>
                      <span
                        className={`font-medium transition-colors duration-200 ${
                          selectedCategory.includes(category.id!)
                            ? "text-primary"
                            : "text-darkGray group-hover:text-primary"
                        }`}
                      >
                        {ringsText[category.name] ?? category.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-darkGray">{t("shop.sortBy")}</h3>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({ sortOrder: e.target.value as SortOrder })
                }
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary  text-lightGray"
              >
                <option value="DESC">{t("shop.newest")}</option>
                <option value="ASC">{t("shop.oldest")}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading && !allProducts.length ? (
            <Loader loaderRef={loaderRef} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-darkGray">{t("shop.noProducts")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Infinite Scroll Loader */}
              {hasMore && <Loader loaderRef={loaderRef} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
