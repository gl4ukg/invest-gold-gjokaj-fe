import axios from 'axios';
import axiosInstance from './api';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  email: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'paypal' | 'card' | 'bank_transfer' | 'cash_on_delivery';
  shippingMethod: 'local' | 'international';
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
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const OrdersService = {
  calculateShippingCost(shippingMethod: string, country: string): number {
    if (shippingMethod === 'local' && country.toLowerCase() === 'kosovo') {
      return 2; // 2 EUR for Kosovo
    }
    // For international shipping, we could implement a more complex calculation
    // based on country and weight/size, but for now returning a fixed rate
    return 15; // 15 EUR for international
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // Calculate shipping cost
      const shippingCost = this.calculateShippingCost(
        orderData.shippingMethod,
        orderData.shippingAddress.country
      );

      // Calculate subtotal
      const subtotal = orderData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Add shipping cost to get total
      const total = subtotal + shippingCost;

      const response = await axiosInstance.post('/orders/guest', {
        ...orderData,
        shippingCost,
        subtotal,
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
      const response = await axiosInstance.post(`/orders/${orderId}/payment`, {
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
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },
};

export default OrdersService;
