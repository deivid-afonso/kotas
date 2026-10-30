import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";
import { requireAuth, requireAdmin, sign } from "./auth.js";

export const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};
  const trimmedName = String(name ?? "").trim();
  const trimmedEmail = String(email ?? "").trim().toLowerCase();

  if (!trimmedName) return res.status(400).json({ error: "Informe seu nome completo." });
  if (trimmedName.length < 3) return res.status(400).json({ error: "Nome deve ter pelo menos 3 caracteres." });
  if (!trimmedEmail) return res.status(400).json({ error: "Informe seu e-mail." });
  if (!EMAIL_RE.test(trimmedEmail)) return res.status(400).json({ error: "Formato de e-mail inválido." });
  if (!password) return res.status(400).json({ error: "Crie uma senha." });
  if (String(password).length < 6) return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres." });

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [trimmedEmail]);
  if (existing.rowCount && existing.rowCount > 0) {
    return res.status(409).json({ error: "Este e-mail já está cadastrado." });
  }

  const hash = await bcrypt.hash(String(password), 10);
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role",
    [trimmedName, trimmedEmail, hash],
  );
  const user = result.rows[0];
  const token = sign({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const trimmed = String(email ?? "").trim().toLowerCase();
  if (!trimmed) return res.status(400).json({ error: "Informe seu e-mail." });
  if (!EMAIL_RE.test(trimmed)) return res.status(400).json({ error: "Formato de e-mail inválido." });
  if (!password) return res.status(400).json({ error: "Informe sua senha." });

  const result = await pool.query(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
    [trimmed],
  );
  const row = result.rows[0];
  if (!row || !(await bcrypt.compare(String(password), row.password_hash))) {
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  }

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const token = sign({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [req.user!.id],
  );
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json({ user });
});

router.get("/users", requireAuth, requireAdmin, async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC",
  );
  res.json(result.rows);
});

router.post("/requests", requireAuth, async (req, res) => {
  const { serviceId, serviceName } = req.body ?? {};
  if (!serviceId || !serviceName) {
    return res.status(400).json({ error: "serviceId e serviceName são obrigatórios." });
  }
  const result = await pool.query(
    `INSERT INTO service_requests (user_id, service_id, service_name)
     VALUES ($1, $2, $3) RETURNING id, user_id, service_id, service_name, status, created_at`,
    [req.user!.id, Number(serviceId), String(serviceName)],
  );
  res.status(201).json(result.rows[0]);
});

router.get("/requests/mine", requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, user_id, service_id, service_name, status, created_at
     FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user!.id],
  );
  res.json(result.rows);
});

router.get("/requests", requireAuth, requireAdmin, async (_req, res) => {
  const result = await pool.query(
    `SELECT r.id, r.user_id, r.service_id, r.service_name, r.status, r.created_at,
            u.name AS user_name, u.email AS user_email
     FROM service_requests r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`,
  );
  res.json(result.rows);
});

router.patch("/requests/:id", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body ?? {};
  if (!["aprovado", "recusado"].includes(status)) {
    return res.status(400).json({ error: "Status deve ser 'aprovado' ou 'recusado'." });
  }
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido." });

  const result = await pool.query(
    "UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING id, status",
    [status, id],
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Solicitação não encontrada." });
  res.json(result.rows[0]);
});
