import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      service_id INTEGER NOT NULL,
      service_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'solicitado',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_user ON service_requests(user_id);`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";
  if (adminEmail && adminPassword) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [adminEmail.toLowerCase()]);
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
        [adminName, adminEmail.toLowerCase(), hash],
      );
      console.log(`Admin ${adminEmail} criado.`);
    }
  }
}
