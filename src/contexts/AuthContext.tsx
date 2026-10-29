import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  participantId?: number;
}

type AccountRecord = User & { password: string };

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  isAdmin: boolean;
}

const builtInAccounts: AccountRecord[] = [
  { id: 0, name: "Deivid Afonso", email: "deividsa@gmail.com", role: "admin", password: "Pedro123@@11" },
];

const REGISTERED_KEY = "assina-registered";

function loadRegistered(): AccountRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw) as AccountRecord[];
  } catch { /* corrupted */ }
  return [];
}

function saveRegistered(list: AccountRecord[]) {
  try { localStorage.setItem(REGISTERED_KEY, JSON.stringify(list)); } catch { /* ok */ }
}

function allAccounts(): AccountRecord[] {
  return [...builtInAccounts, ...loadRegistered()];
}

const AuthContext = createContext<AuthState | null>(null);

function readSession(): User | null {
  try {
    const raw = localStorage.getItem("assina-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    const all = allAccounts();
    if (all.some((a) => a.id === parsed.id && a.email === parsed.email)) return parsed;
  } catch { /* corrupted */ }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);

  const login = useCallback((email: string, password: string): string | null => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return "Informe seu e-mail.";
    if (!EMAIL_RE.test(trimmed)) return "Formato de e-mail inválido.";
    if (!password) return "Informe sua senha.";

    const account = allAccounts().find((a) => a.email === trimmed);
    if (!account || account.password !== password) return "E-mail ou senha incorretos.";

    const { password: _pw, ...userData } = account;
    void _pw;
    try { localStorage.setItem("assina-session", JSON.stringify(userData)); } catch { /* ok */ }
    setUser(userData);
    return null;
  }, []);

  const register = useCallback((name: string, email: string, password: string): string | null => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return "Informe seu nome completo.";
    if (trimmedName.length < 3) return "Nome deve ter pelo menos 3 caracteres.";
    if (!trimmedEmail) return "Informe seu e-mail.";
    if (!EMAIL_RE.test(trimmedEmail)) return "Formato de e-mail inválido.";
    if (!password) return "Crie uma senha.";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres.";

    const all = allAccounts();
    if (all.some((a) => a.email === trimmedEmail)) return "Este e-mail já está cadastrado.";

    const nextId = Math.max(...all.map((a) => a.id)) + 1;
    const newAccount: AccountRecord = {
      id: nextId,
      name: trimmedName,
      email: trimmedEmail,
      role: "user",
      password,
    };

    const registered = loadRegistered();
    registered.push(newAccount);
    saveRegistered(registered);

    const { password: _pw, ...userData } = newAccount;
    void _pw;
    try { localStorage.setItem("assina-session", JSON.stringify(userData)); } catch { /* ok */ }
    setUser(userData);
    return null;
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem("assina-session"); } catch { /* ok */ }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout, isAdmin: user?.role === "admin" }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
