"use client";
import React, { useState } from "react";
import AuthService from "@/app/services/auth";
import { useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const login = await AuthService.login(email, password);
      if (login) {
        router.push("/admin");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-lightGray text-center">
          Login Page
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-darkGray"
            >
              Username:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-darkGray"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-darkGray"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-darkGray"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-lightGray rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-darkGray"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
