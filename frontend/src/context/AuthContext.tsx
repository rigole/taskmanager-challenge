import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

  const login = async (data: LoginRequest) => {
    const response = await apiLogin(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("email", response.email);
    setEmail(response.email);
  };

  const register = async (data: RegisterRequest) => {
    const response = await apiRegister(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("email", response.email);
    setEmail(response.email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ email, isAuthenticated: !!email, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}