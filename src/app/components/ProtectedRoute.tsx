"use client";
import React from "react";
import { redirect, useRouter } from "@/i18n/routing";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
}) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push('/admin')
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
