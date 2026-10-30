import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { AuthUser } from "../api/auth";
import { ApiError, getToken } from "../api/client";

export type Role = "admin" | "user";
export type User = AuthUser;

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    authApi.me()
      .then((u) => { if (!cancelled) setUser(u); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const u = await authApi.login(email, password);
      setUser(u);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : "Erro ao fazer login.";
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const u = await authApi.register(name, email, password);
      setUser(u);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : "Erro ao cadastrar.";
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAdmin: user?.role === "admin" }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
