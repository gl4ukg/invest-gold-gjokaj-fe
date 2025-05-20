import axios from "axios";
import axiosClient from "./api";
import axiosServer from "./axiosServer";
import { CreateProduct, Product } from "../types/product.types";

export interface SearchParam {
  query?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
    items: Product[],
    meta: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
  

const ProductsService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get("/products");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  search: async (payload: SearchParam): Promise<SearchResponse> => {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.post(`/products/search`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          if (typeof window === 'undefined') {
            throw new Error('Unauthorized');
          } else {
            throw error.response?.data;
          }
        }
        throw error.response?.data;
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get(`/products/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  create: async (productData: CreateProduct): Promise<Product> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axiosClient.post("/products", productData, {
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

  update: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axiosClient.post(
        `/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axiosClient.post(
        `/products/${id}/delete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },
};

export default ProductsService;
