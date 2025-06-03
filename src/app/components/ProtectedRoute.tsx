"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import AuthService from "@/app/services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AuthService.getUserFromSession();
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // or show a loading spinner
  }

  return <>{isAuthenticated && children}</>;
};

export default ProtectedRoute;
