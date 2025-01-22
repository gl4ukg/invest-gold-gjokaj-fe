'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ProductsService from '@/app/services/products';
import CategoriesService from '@/app/services/categories';
import { Product } from '@/app/types/product.types';
import { Category } from '@/app/types/category.types';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import Cart from '@/app/components/Cart';
import { FaShoppingCart, FaFilter } from 'react-icons/fa';
import { debounce } from 'lodash';

interface Filter {
    minPrice: number;
    maxPrice: number;
    sortBy: 'price_asc' | 'price_desc' | 'newest';
}

export default function Shop() {
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
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const { addToCart, itemCount } = useCart();
    const t = useTranslations();

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
    }) => {
        try {
            setLoading(true);
            const response = await ProductsService.search({
                search: params.search,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                categoryId: params.categoryId || undefined,
                page: params.page,
                limit: ITEMS_PER_PAGE,
                sortBy: params.sortBy
            });

            setProducts(response.products);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            console.error('Failed to search products:', err);
            setError(t('shop.errorFetchingProducts'));
        } finally {
            setLoading(false);
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
        <div className="container mx-auto px-4 py-8">
            {/* Header with Cart Button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('shop.title')}</h1>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-dark transition-colors"
                >
                    <FaShoppingCart />
                    <span>{t('cart.title')}</span>
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {itemCount}
                        </span>
                    )}
                </button>
            </div>

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
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                        {/* Search */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">{t('shop.search')}</h3>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder={t('shop.searchPlaceholder')}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">{t('shop.categories')}</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === ''}
                                        onChange={() => handleCategoryChange('')}
                                        className="text-primary"
                                    />
                                    <span>{t('shop.allCategories')}</span>
                                </label>
                                {categories.map((category) => (
                                    <label key={category.id} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category.id}
                                            onChange={() => handleCategoryChange(category.id!)}
                                            className="text-primary"
                                        />
                                        <span>{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">{t('shop.priceRange')}</h3>
                            <div className="flex gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">{t('shop.min')}</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">{t('shop.max')}</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">{t('shop.sortBy')}</h3>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({ sortBy: e.target.value as Filter['sortBy'] })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="newest">{t('shop.newest')}</option>
                                <option value="price_asc">{t('shop.priceLowToHigh')}</option>
                                <option value="price_desc">{t('shop.priceHighToLow')}</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">{t('shop.loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">{t('shop.noProducts')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative h-64">
                                            <Image
                                                src={product.image || '/images/placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold">€{product.price}</span>
                                                {product.stock > 0 ? (
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                                    >
                                                        {t('shop.addToCart')}
                                                    </button>
                                                ) : (
                                                    <span className="text-red-500">{t('shop.outOfStock')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg ${
                                                currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}