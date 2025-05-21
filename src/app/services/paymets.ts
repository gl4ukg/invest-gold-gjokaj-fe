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
      }
}

export default PaymentsService;