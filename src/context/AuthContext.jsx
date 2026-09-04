"use client";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser } from "../Services/Auth_Service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
        setAuthLoading(true)
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  },[]);
  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
