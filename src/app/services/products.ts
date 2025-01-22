import axios from 'axios';
import axiosInstance from './api';
import { Product } from '../types/product.types';

interface SearchParams {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

interface SearchResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

const ProductsService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await axiosInstance.get('/products');
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    search: async (params: SearchParams): Promise<SearchResponse> => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.search) queryParams.append('search', params.search);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
            if (params.categoryId) queryParams.append('categoryId', params.categoryId);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.sortBy) queryParams.append('sortBy', params.sortBy.toString());

            const response = await axiosInstance.get(`/products/search?${queryParams.toString()}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Product> => {
        try {
            const response = await axiosInstance.get(`/products/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    create: async (productData: Product): Promise<Product> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.post('/products', productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    update: async (id: string, productData: Partial<Product>): Promise<Product> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.post(`/products/${id}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            await axiosInstance.post(`/products/${id}/delete`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },
};

export default ProductsService;
