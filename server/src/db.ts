import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;

export const pool = url
  ? mysql.createPool(url)
  : mysql.createPool({
      host: process.env.MYSQL_HOST ?? "localhost",
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE ?? "assina",
      waitForConnections: true,
      connectionLimit: 10,
    });

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'user',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      service_id INT NOT NULL,
      service_name VARCHAR(255) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'solicitado',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_requests_user (user_id),
      CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";
  if (adminEmail && adminPassword) {
    const [rows] = await pool.query<any[]>("SELECT id FROM users WHERE email = ?", [adminEmail.toLowerCase()]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
        [adminName, adminEmail.toLowerCase(), hash],
      );
      console.log(`Admin ${adminEmail} criado.`);
    }
  }
}
