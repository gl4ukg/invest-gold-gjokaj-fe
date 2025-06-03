import axios from "axios";
import axiosClient from "./api";
import { User } from "../types/auth.types";

const STORAGE_KEY = "questionnaire_state";

const AuthService = {
  getUserFromSession: async (): Promise<any | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    const userProfile = await AuthService.getProfile();
    if (userProfile) {
      return userProfile;
    }
    return null;
  },

  saveToken: (token: string): void => {
    localStorage.setItem("token", token);
  },

  clearToken: (): void => {
    localStorage.removeItem("token");
  },

  register: async (userData: User): Promise<any> => {
    try {
      const response = await axiosClient.post("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<{token: string, user: Partial<User>}> => {
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      AuthService.saveToken(response.data.token);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  },

  getProfile: async (): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return null;
      }

      const response = await axiosClient.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data) {
        console.warn("No user data received from profile endpoint");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If unauthorized, clear token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return null;
    }
  },

  updateProfile: async (userData: User): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");
    try {
      const response = await axiosClient.put("/auth/profile", userData, {
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

  logout: (): void => {
    AuthService.clearToken();
  },
};

export default AuthService;
