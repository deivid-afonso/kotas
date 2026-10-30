import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export interface AuthUser {
  id: number;
  email: string;
  role: "admin" | "user";
}

export function sign(user: AuthUser): string {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito ao administrador." });
  }
  next();
}
