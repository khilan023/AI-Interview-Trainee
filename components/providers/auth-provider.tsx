"use client";

import * as React from "react";
import type { User } from "@/lib/types";
import { authApi, setAccessToken, getAccessToken } from "@/lib/api";
import { mockUser } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// For demo purposes, we'll use mock authentication
// In production, this will connect to your FastAPI backend
const USE_MOCK_AUTH = true;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      
      if (!token) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      if (USE_MOCK_AUTH) {
        // Mock: if we have a token, assume user is logged in
        setState({ user: mockUser, isLoading: false, isAuthenticated: true });
        return;
      }

      // Real API call
      const { data, error } = await authApi.getProfile();
      if (error || !data) {
        setAccessToken(null);
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      setState({ user: data, isLoading: false, isAuthenticated: true });
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (USE_MOCK_AUTH) {
      // Mock login - accept any credentials
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      setAccessToken("mock-token-123");
      setState({ user: mockUser, isLoading: false, isAuthenticated: true });
      return true;
    }

    const { data, error } = await authApi.login({ email, password });
    if (error || !data) {
      return false;
    }

    setAccessToken(data.token);
    setState({ user: data.user, isLoading: false, isAuthenticated: true });
    return true;
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    if (USE_MOCK_AUTH) {
      // Mock signup
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newUser = { ...mockUser, email, name };
      setAccessToken("mock-token-123");
      setState({ user: newUser, isLoading: false, isAuthenticated: true });
      return true;
    }

    const { data, error } = await authApi.signup({ email, password, name });
    if (error || !data) {
      return false;
    }

    setAccessToken(data.token);
    setState({ user: data.user, isLoading: false, isAuthenticated: true });
    return true;
  };

  const logout = async () => {
    if (!USE_MOCK_AUTH) {
      await authApi.logout();
    }
    setAccessToken(null);
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (USE_MOCK_AUTH) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
      return true;
    }

    const { data: updatedUser, error } = await authApi.updateProfile(data);
    if (error || !updatedUser) {
      return false;
    }

    setState((prev) => ({ ...prev, user: updatedUser }));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
