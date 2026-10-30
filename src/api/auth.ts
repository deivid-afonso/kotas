import { api, setToken } from "./client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const { token, user } = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(token);
  return user;
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  const { token, user } = await api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setToken(token);
  return user;
}

export async function me(): Promise<AuthUser | null> {
  try {
    const { user } = await api<{ user: AuthUser }>("/auth/me");
    return user;
  } catch {
    setToken(null);
    return null;
  }
}

export function logout() {
  setToken(null);
}
