"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../Services/Auth_Service";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { user, isLoaded, isSignedIn } = useUser();

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        setAdminUser(response.user);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error(error);
      setAdminUser(null);
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        adminUser,
        setAdminUser,
        authLoading,
        checkAuth,
        user,
        isSignedIn,
        authLoading: !isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
