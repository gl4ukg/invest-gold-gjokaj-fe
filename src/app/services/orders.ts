import axios from 'axios';
import axiosClient from './api';
import axiosServer from './axiosServer';
import { CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';
import { ConfiguratorState } from '../types/configurator';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  id?: string;
  product: Product;
  configuration?: ConfiguratorState;
  quantity?: number;
  price: number
}

export interface CreateOrderRequest {
  email: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'paypal' | 'card' | 
//   'bank_transfer' |
   'cash_on_delivery';
  shippingMethod: 'local' | 'international';
  subtotal: number;
}
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
export interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const OrdersService = {
  calculateShippingCost(shippingMethod: string, country: string): number {
    const countryLower = country.toLowerCase().trim();
    const shippingMethodLower = shippingMethod.toLowerCase().trim();

    if (shippingMethodLower === 'local' && 
        (countryLower === 'kosovo' || countryLower === 'kosova' || countryLower === 'kosovë' || 
         countryLower === 'albania' || countryLower === 'shqiperi' || countryLower === 'shqipëri')) {
      return 2;
    }

    // International shipping rates based on regions
    if (shippingMethodLower === 'international') {
      // European countries
    //   const europeanCountries = [
    //     'germany', 'deutschland', 'france', 'italia', 'italy', 'spain', 'españa',
    //     'switzerland', 'schweiz', 'austria', 'österreich', 'belgium', 'netherlands',
    //     'sweden', 'norway', 'denmark', 'finland', 'greece'
    //   ];
      
    //   if (europeanCountries.includes(countryLower)) {
    //     return 15; // 15 EUR for European countries
    //   }
      
      return 50;
    }

    return 2;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // Calculate shipping cost
      const shippingCost = this.calculateShippingCost(
        orderData.shippingMethod,
        orderData.shippingAddress.country
      );


      // Add shipping cost to get total
      const total = orderData.subtotal + shippingCost;

      console.log({
        ...orderData,
        shippingCost,
        subtotal: orderData.subtotal,
        total,
      },"order data qokla")

      const response = await axiosClient.post('/orders/guest', {
        ...orderData,
        shippingCost,
        subtotal: orderData.subtotal,
        total,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  async initiatePayment(orderId: string, paymentMethod: string): Promise<any> {
    try {
      const response = await axiosClient.post(`/orders/${orderId}/payment`, {
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<Order> {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  async getAll(): Promise<Order[]> {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get(`/orders`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const { data: updatedOrder } = await axiosClient.patch(`/orders/${orderId}/status`, {
        status,
      });
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

export default OrdersService;
