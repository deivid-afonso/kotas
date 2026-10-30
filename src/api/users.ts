import { api } from "./client";

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

export const listUsers = () => api<RegisteredUser[]>("/users");
