import axios from "axios";
import axiosClient from "./api";
import axiosServer from "./axiosServer";


const PaymentsService = {

  initiateCardPayment: async (payload: {
      orderId: string;
      amount: number;
      currency: string;
      returnUrl: string;
    }) => {
      try {
        const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
        const response = await instance.post('/payment', payload);
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data;
        }
        throw error;
      }
    },
    async refundOrder(transactionId: string): Promise<any> {
      try {
        const response = await axiosClient.post(`/payment/refund/${transactionId}`);
        return response.data;
      } catch (error) {
        console.error('Error refunding order:', error);
        throw error;
      }
    },
}

export default PaymentsService;