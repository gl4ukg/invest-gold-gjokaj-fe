import axios from "axios";
import axiosClient from "./api";
import axiosServer from "./axiosServer";
import { CreateProduct, Product } from "../types/product.types";

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

let productsCache: CacheItem<Product[]> | null = null;
let searchCache: Map<string, CacheItem<SearchResponse>> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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
      // Check if we have valid cached data
      if (productsCache && (Date.now() - productsCache.timestamp) < CACHE_DURATION) {
        return productsCache.data;
      }

      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get("/products");
      
      // Update cache
      productsCache = {
        data: response.data,
        timestamp: Date.now()
      };
      
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
      // Create a cache key from the search parameters
      const cacheKey = JSON.stringify(payload);
      
      // Check if we have valid cached data for this search
      const cachedResult = searchCache.get(cacheKey);
      if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
        return cachedResult.data;
      }

      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.post(`/products/search`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Update cache
      searchCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
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
