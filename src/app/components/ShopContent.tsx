"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslations } from 'next-intl';
import ProductsService from "@/app/services/products";
import CategoriesService from "@/app/services/categories";
import { Product } from "@/app/types/product.types";
import { Category } from "@/app/types/category.types";
import { debounce } from "lodash";
import dynamic from 'next/dynamic';

// Dynamically import components
const SearchBar = dynamic(() => import('./shop/SearchBar'), {
  ssr: true,
});

const Filters = dynamic(() => import('./shop/Filters'), {
  ssr: true,
});

const ProductGrid = dynamic(() => import('./shop/ProductGrid'), {
  ssr: true,
});

interface Filter {
  sortOrder: "ASC" | "DESC";
}

export default function ShopContent() {
  const t = useTranslations();
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
    sortOrder: "DESC",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const loaderRef = useRef<HTMLDivElement>(null);

  // Memoize categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [categories]);

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
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);

    debouncedSearch({
      query: newSearchTerm,
      categoryIds: selectedCategory,
      sortOrder: filters.sortOrder,
      page: 1,
    });
  }, [selectedCategory, filters.sortOrder, debouncedSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<Filter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    setHasMore(true);
    
    searchProducts({
      query: searchTerm,
      categoryIds: selectedCategory,
      sortOrder: updatedFilters.sortOrder,
      page: 1,
    });
  }, [searchTerm, selectedCategory, filters, searchProducts]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
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
  }, [selectedCategory, searchTerm, filters.sortOrder, searchProducts]);

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

  // Intersection Observer setup with debounce
  useEffect(() => {
    const observer = new IntersectionObserver(
      debounce((entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      }, 100),
      { threshold: 0.5, rootMargin: '100px' }
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
  }, [hasMore, loadingMore, loading, loadMore]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Initial search and data fetching
  useEffect(() => {
    // Only search if we have a search term or categories selected
    if (searchTerm !== "" || selectedCategory.length > 0) {
      searchProducts({
        query: searchTerm,
        categoryIds: selectedCategory,
        sortOrder: filters.sortOrder,
        page: currentPage,
      });
    } else {
      // If no search criteria, fetch initial products
      searchProducts({
        query: "",
        categoryIds: [],
        sortOrder: filters.sortOrder,
        page: 1,
      });
    }
  }, [searchTerm, selectedCategory, filters.sortOrder, currentPage, searchProducts]);

  const ringsText: { [key: string]: string } = {
    "Ari i Verdhë": t("rings.yellowGold"),
    "Ari i Bardhë": t("rings.whiteGold"),
    "Ari Rozë": t("rings.roseGold"),
    "Ari Dy-ngjyrësh": t("rings.twoColorGold"),
    "Ari Shumëngjyrësh": t("rings.multiColorGold"),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <SearchBar 
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <Filters
          categories={memoizedCategories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          filters={filters}
          handleFilterChange={handleFilterChange}
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        />

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid
            products={allProducts}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loaderRef={loaderRef}
          />
        </div>
      </div>
    </div>
  );
}
