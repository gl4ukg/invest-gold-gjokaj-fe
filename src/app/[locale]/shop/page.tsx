'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ProductsService from '@/app/services/products';
import CategoriesService from '@/app/services/categories';
import { Product } from '@/app/types/product.types';
import { Category } from '@/app/types/category.types';
import { useCart } from '@/app/context/CartContext';
import Cart from '@/app/components/Cart';
import { FaShoppingCart, FaFilter } from 'react-icons/fa';
import { debounce } from 'lodash';
import { useRouter } from '@/i18n/routing';
import ProductCard from '@/app/components/ProductCard';
import Loader from '@/app/components/Loader';

interface Filter {
    minPrice: number;
    maxPrice: number;
    sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}

export default function Shop() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<Filter>({
        minPrice: 0,
        maxPrice: 10000,
        sortBy: 'newest'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const { itemCount, isCartOpen, setIsCartOpen } = useCart();
    const t = useTranslations();
    const router = useRouter();
    const loaderRef = useRef<HTMLDivElement>(null);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoriesService.getAll();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError(t('shop.errorFetchingCategories'));
        }
    };

    const searchProducts = async (params: {
        search: string;
        categoryId: string;
        minPrice: number;
        maxPrice: number;
        sortBy: string;
        page: number;
        loadMore?: boolean;
    }) => {
        try {
            if (!params.loadMore) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            // Add artificial delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const response = await ProductsService.search({
                search: params.search,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                categoryId: params.categoryId || undefined,
                page: params.page,
                limit: ITEMS_PER_PAGE,
                sortBy: params.sortBy
            });

            if (params.loadMore) {
                setAllProducts(prev => [...prev, ...response.products]);
            } else {
                setAllProducts(response.products);
            }
            
            setHasMore(response.products.length === ITEMS_PER_PAGE);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            console.error('Failed to search products:', err);
            setError(t('shop.errorFetchingProducts'));
        } finally {
            if (!params.loadMore) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((params) => {
            searchProducts(params);
        }, 500),
        []
    );

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        debouncedSearch({
            search: newSearchTerm,
            categoryId: selectedCategory,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            page: currentPage
        });
    };

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<Filter>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        setCurrentPage(1); // Reset to first page when filters change
        setHasMore(true);
        
        searchProducts({
            search: searchTerm,
            categoryId: selectedCategory,
            minPrice: updatedFilters.minPrice,
            maxPrice: updatedFilters.maxPrice,
            sortBy: updatedFilters.sortBy,
            page: 1
        });
    };

    // Handle category change
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to first page when category changes
        
        searchProducts({
            search: searchTerm,
            categoryId: categoryId,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            page: 1
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        
        searchProducts({
            search: searchTerm,
            categoryId: selectedCategory,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            page: page
        });
    };

    // Load more products
    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        searchProducts({
            search: searchTerm,
            categoryId: selectedCategory,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            page: nextPage,
            loadMore: true
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
        searchProducts({
            search: searchTerm,
            categoryId: selectedCategory,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            page: currentPage
        });
    }, []);

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filters Button */}
                <button
                    className="lg:hidden flex items-center gap-2 text-primary"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <FaFilter /> {t('shop.filters')}
                </button>

                {/* Filters Sidebar */}
                <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
                    <div className="bg-gray rounded-lg shadow-lg p-6 sticky top-4">
                        {/* Search */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-darkGray">{t('shop.search')}</h3>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder={t('shop.searchPlaceholder')}
                                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightGray"
                            />
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-darkGray">{t('shop.categories')}</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === ''}
                                        onChange={() => handleCategoryChange('')}
                                        className=" text-lightGray"
                                    />
                                    <span className="text-darkGray">{t('shop.allCategories')}</span>
                                </label>
                                {categories?.map((category) => (
                                    <label key={category.id} className="flex items-center text-darkGray gap-2">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category.id}
                                            onChange={() => handleCategoryChange(category.id!)}
                                            className="text-lightGray"
                                        />
                                        <span className="text-darkGray">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        {/* <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-darkGray">{t('shop.priceRange')}</h3>
                            <div className="flex gap-4">
                                <div>
                                    <label className="text-sm text-darkGray">{t('shop.min')}</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightGray"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-darkGray">{t('shop.max')}</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightGray"
                                    />
                                </div>
                            </div>
                        </div> */}

                        {/* Sort */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-darkGray">{t('shop.sortBy')}</h3>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({ sortBy: e.target.value as Filter['sortBy'] })}
                                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary  text-lightGray"
                            >
                                <option value="newest">{t('shop.newest')}</option>
                                <option value="oldest">{t('shop.oldest')}</option>
                                {/* <option value="price_asc">{t('shop.priceLowToHigh')}</option>
                                <option value="price_desc">{t('shop.priceHighToLow')}</option> */}
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
                            <p className="text-darkGray">{t('shop.noProducts')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allProducts?.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Infinite Scroll Loader */}
                            {hasMore && (<Loader loaderRef={loaderRef} />
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}