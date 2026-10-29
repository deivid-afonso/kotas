import express from "express";
const app = express();
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true, timezone: "America/Sao_Paulo" }));
app.get("/api/services", (_req, res) => res.json([]));
app.get("/api/participants", (_req, res) => res.json([]));
app.get("/api/charges", (_req, res) => res.json([]));
app.post("/api/pix/webhook", (req, res) => {
  const { pix_charge_id: pixChargeId, status } = req.body ?? {};
  if (!pixChargeId || status !== "paid") return res.status(400).json({ error: "Evento PIX inválido." });
  res.json({ ok: true, received: pixChargeId });
});
app.listen(process.env.PORT ?? 3000, () => console.log("API Assina em http://localhost:3000"));
