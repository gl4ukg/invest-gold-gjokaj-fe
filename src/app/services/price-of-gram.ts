import axios from "axios";
import axiosServer from "./axiosServer";
import axiosClient from "./api";
import { PriceOfGram } from "../types/price-of-gram.types";

const PriceOfGramService = {
    get: async (): Promise<PriceOfGram> => {
        try {
            const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
            const response = await instance.get("/price-of-gram");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },
    create: async (price: number): Promise<PriceOfGram> => {
        try {
            const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
            const response = await instance.post(`/price-of-gram`, { price });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        }
    },
}

export default PriceOfGramService
