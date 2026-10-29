PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, plan TEXT NOT NULL,
  annual_value_cents INTEGER NOT NULL CHECK (annual_value_cents >= 0),
  charge_value_cents INTEGER NOT NULL CHECK (charge_value_cents >= 0),
  contracted_at TEXT NOT NULL, renews_at TEXT NOT NULL, reference_seats INTEGER NOT NULL DEFAULT 0,
  notes TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL, notes TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT, participant_id INTEGER NOT NULL REFERENCES participants(id),
  service_id INTEGER NOT NULL REFERENCES services(id), status TEXT NOT NULL CHECK (status IN ('solicitado','aprovado','recusado','ativo','pausado','removido')),
  requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, decided_at TEXT, notes TEXT,
  UNIQUE(participant_id, service_id)
);
CREATE TABLE IF NOT EXISTS annual_charges (
  id INTEGER PRIMARY KEY AUTOINCREMENT, participant_id INTEGER NOT NULL REFERENCES participants(id),
  reference_year INTEGER NOT NULL, due_at TEXT NOT NULL, total_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pendente','pago','vencido','cancelado','isento')),
  pix_charge_id TEXT, proof_url TEXT, paid_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS annual_charge_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, charge_id INTEGER NOT NULL REFERENCES annual_charges(id),
  service_id INTEGER NOT NULL REFERENCES services(id), base_cents INTEGER NOT NULL,
  adjustment_cents INTEGER NOT NULL DEFAULT 0, adjustment_reason TEXT, months_charged INTEGER NOT NULL DEFAULT 12
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, entity TEXT NOT NULL,
  entity_id INTEGER NOT NULL, action TEXT NOT NULL, before_json TEXT, after_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
