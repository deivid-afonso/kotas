import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import { router } from "./routes.js";

const app = express();

const origin = process.env.FRONTEND_ORIGIN;
app.use(cors({ origin: origin ? [origin, "http://localhost:5173"] : true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", router);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

const port = Number(process.env.PORT ?? 3000);

initDb()
  .then(() => {
    app.listen(port, () => console.log(`API Assina rodando na porta ${port}`));
  })
  .catch((err) => {
    console.error("Falha ao inicializar banco:", err);
    process.exit(1);
  });
