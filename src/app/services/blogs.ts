import axios from "axios";
import axiosClient from "./api";
import axiosServer from "./axiosServer";
import { Blog, CreateBlog } from "../types/blog.types";

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

let blogsCache: CacheItem<Blog[]> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const BlogsService = {
  getAll: async (): Promise<Blog[]> => {
    try {
      // Check if we have valid cached data
      if (blogsCache && (Date.now() - blogsCache.timestamp) < CACHE_DURATION) {
        return blogsCache.data;
      }

      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get("/blogs");
      
      // Update cache
      blogsCache = {
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

  getById: async (id: string): Promise<Blog> => {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get(`/blogs/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<Blog> => {
    try {
      const instance = typeof window === 'undefined' ? axiosServer : axiosClient;
      const response = await instance.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  create: async (blogData: CreateBlog): Promise<Blog> => {
    try {
      if (typeof window === "undefined") {
        throw new Error("This operation is only available on the client side");
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axiosClient.post("/blogs", blogData, {
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

  update: async (id: string, blogData: Partial<Blog>): Promise<Blog> => {
    try {
      if (typeof window === "undefined") {
        throw new Error("This operation is only available on the client side");
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axiosClient.patch(`/blogs/${id}`, blogData, {
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
      if (typeof window === "undefined") {
        throw new Error("This operation is only available on the client side");
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axiosClient.delete(`/blogs/${id}`, {
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

export default BlogsService;
