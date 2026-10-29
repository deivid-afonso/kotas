import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  participantId?: number;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  isAdmin: boolean;
}

const accounts: (User & { password: string })[] = [
  { id: 0, name: "Admin Costa", email: "admin@assina.com", role: "admin", password: "admin123" },
  { id: 1, name: "Mariana Costa", email: "mariana@email.com", role: "user", participantId: 1, password: "mariana123" },
  { id: 2, name: "Rafael Nunes", email: "rafael@email.com", role: "user", participantId: 2, password: "rafael123" },
  { id: 3, name: "João Pedro Alves", email: "joao@email.com", role: "user", participantId: 3, password: "joao123" },
  { id: 4, name: "Camila Rocha", email: "camila@email.com", role: "user", participantId: 4, password: "camila123" },
  { id: 5, name: "Lucas Martins", email: "lucas@email.com", role: "user", participantId: 5, password: "lucas123" },
];

const AuthContext = createContext<AuthState | null>(null);

function readSession(): User | null {
  try {
    const raw = localStorage.getItem("assina-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (accounts.some((a) => a.id === parsed.id && a.email === parsed.email)) return parsed;
  } catch { /* corrupted */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);

  const login = useCallback((email: string, password: string): string | null => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return "Informe seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Formato de e-mail inválido.";
    if (!password) return "Informe sua senha.";

    const account = accounts.find((a) => a.email === trimmed);
    if (!account || account.password !== password) return "E-mail ou senha incorretos.";

    const { password: _pw, ...userData } = account;
    void _pw;
    try { localStorage.setItem("assina-session", JSON.stringify(userData)); } catch { /* ok */ }
    setUser(userData);
    return null;
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem("assina-session"); } catch { /* ok */ }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout, isAdmin: user?.role === "admin" }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
