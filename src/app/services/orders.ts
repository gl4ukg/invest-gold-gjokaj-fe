import axios from 'axios';
import axiosInstance from './api';
import { Order } from '../types/order.types';

const OrdersService = {
    createGuestOrder: async (orderData: Order): Promise<Order> => {
        try {
            const response = await axiosInstance.post('/orders/guest', orderData);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },

    getAll: async (): Promise<Order[]> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.get('/orders', {
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

    getById: async (id: string): Promise<Order> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.get(`/orders/${id}`, {
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

    updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axiosInstance.post(`/orders/${id}/status`, { status }, {
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
};

export default OrdersService;
