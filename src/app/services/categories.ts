import axios from 'axios';
import axiosInstance from './api';
import { Category } from '../types/category.types';

const CategoriesService = {
    getAll: async (): Promise<Category[]> => {
        try {
            const response = await axiosInstance.get('/categories');
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Category> => {
        try {
            const response = await axiosInstance.get(`/categories/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    create: async (categoryData: Category): Promise<Category> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.post('/categories', categoryData, {
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

    update: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.post(`/categories/${id}`, categoryData, {
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

            await axiosInstance.post(`/categories/${id}/delete`, {}, {
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

export default CategoriesService;
