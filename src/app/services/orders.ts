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
  productId: string | undefined;
  quantity: number;
  price: number;
  total?: string;
  id?: string;
  product?: {
    id: string;
    name: string;
  }
}

export interface CreateOrderRequest {
  email: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'paypal' | 'card' | 
//   'bank_transfer' |
   'cash_on_delivery';
  shippingMethod: 'local' | 'international';
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
      
      return 25;
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

  async getAll(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/orders`);
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
      const { data: updatedOrder } = await axiosInstance.patch(`/orders/${orderId}/status`, {
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
