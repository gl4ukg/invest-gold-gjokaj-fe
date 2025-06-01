"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import ProductsService from "@/app/services/products";
import CategoriesService from "@/app/services/categories";
import { Product } from "@/app/types/product.types";
import { Category } from "@/app/types/category.types";
import { FaFilter } from "react-icons/fa";
import { debounce } from "lodash";
import ProductCard from "@/app/components/ProductCard";
import Loader from "@/app/components/Loader";

interface Filter {
  sortOrder: "ASC" | "DESC";
}

export default function ShopContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    sortOrder: "DESC", // Default to newest first
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const t = useTranslations();
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await CategoriesService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(t("shop.errorFetchingCategories"));
    }
  };

  const searchProducts = async (params: {
    query?: string;
    categoryIds: string[];
    sortOrder?: string;
    page: number;
    loadMore?: boolean;
  }) => {
    try {
      if (!params.loadMore) {
        setLoading(true);
      }

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await ProductsService.search({
        query: params.query || "", // Ensure query is never undefined
        categoryIds: params.categoryIds,
        page: params.page,
        limit: ITEMS_PER_PAGE,
        sortOrder: params.sortOrder,
      });

      if (params.loadMore) {
        setAllProducts((prev) => [...prev, ...response.items]);
      } else {
        setAllProducts(response.items);
      }

      setHasMore(response.items.length === ITEMS_PER_PAGE);
      setTotalPages(response.meta.totalPages);
      setError(null);
    } catch (err) {
      console.error("Failed to search products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((params: {
      query?: string;
      categoryIds: string[];
      sortOrder: string;
      page: number;
    }) => {
      searchProducts(params);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);

    debouncedSearch({
      query: newSearchTerm,
      categoryIds: selectedCategory,
      sortOrder: filters.sortOrder,
      page: 1,
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<Filter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setHasMore(true);
    searchProducts({
      query: searchTerm,
      categoryIds: selectedCategory,
      sortOrder: updatedFilters.sortOrder,
      page: 1,
    });
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const newSelection = selectedCategory.includes(categoryId)
      ? selectedCategory.filter(id => id !== categoryId)
      : [...selectedCategory, categoryId];
    
    setSelectedCategory(newSelection);
    setCurrentPage(1);

    searchProducts({
      query: searchTerm,
      categoryIds: newSelection,
      sortOrder: filters.sortOrder,
      page: 1,
    });
  };

  // Load more products
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

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loadingMore, loading, currentPage]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Initial search
  useEffect(() => {
    if (searchTerm !== undefined) {
      searchProducts({
        query: searchTerm,
        categoryIds: selectedCategory,
        sortOrder: filters.sortOrder,
        page: currentPage,
      });
    }
  }, [searchTerm]);

  const ringsText: { [key: string]: string } = {
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
        <aside
          className={`lg:w-1/4 ${
            isMobileFiltersOpen ? "block" : "hidden"
          } lg:block`}
        >
          <div className="bg-gray rounded-lg shadow-lg p-6 sticky top-4">
            {/* Search */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-darkGray">
                {t("shop.search")}
              </h3>
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
              <h3 className="text-lg font-semibold mb-4 text-darkGray">
                {t("shop.categories")}
              </h3>
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
                                                    ${
                                                      selectedCategory.includes(category.id!)
                                                        ? "scale-100 opacity-100"
                                                        : "scale-0 opacity-0"
                                                    }`}
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
                        {ringsText[category.name]}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-darkGray">
                {t("shop.sortBy")}
              </h3>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({
                    sortOrder: e.target.value as Filter["sortOrder"],
                  })
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
          {loading ? (
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
                {allProducts?.map((product) => (
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
