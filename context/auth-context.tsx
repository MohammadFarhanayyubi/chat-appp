"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  avatarLink?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchProfile = async (authToken?: string) => {
    const currentToken = authToken || token || localStorage.getItem("authToken");
    if (!currentToken) {
      setUser(null);
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          "Authorization": `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        fetchProfile(storedToken).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        await fetchProfile(data.token);
        return { success: true, message: data.message || "Login successful" };
      }

      return { success: false, message: data.message || "Login failed" };
    } catch {
      return { success: false, message: "Network error. Make sure your backend server is running at " + API_BASE_URL };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || "Registration failed" };
    } catch {
      return { success: false, message: "Network error. Make sure your backend server is running at " + API_BASE_URL };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
