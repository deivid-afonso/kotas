import { useState } from "react";
import { ChevronDown, Search, Users } from "lucide-react";
import { getRequests } from "../stores/serviceRequests";
import { services } from "../data";

interface RegisteredAccount {
  id: number;
  name: string;
  email: string;
  role: string;
}

function loadRegisteredUsers(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem("assina-registered");
    if (raw) return JSON.parse(raw) as RegisteredAccount[];
  } catch { /* corrupted */ }
  return [];
}

export default function Participants() {
  const [query, setQuery] = useState("");
  const users = loadRegisteredUsers().filter((u) => u.role === "user");
  const requests = getRequests();

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTÃO</p>
          <h1>Participantes</h1>
          <p className="muted">Pessoas cadastradas na plataforma.</p>
        </div>
        <span className="info-chip">
          <Users size={15} /> {users.length} cadastrado{users.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Buscar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar participante"
          />
        </div>
        <button className="filter-btn">
          Todos <ChevronDown size={15} />
        </button>
      </div>
      <div className="panel table-wrap">
        {filtered.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: 40 }}>
            {users.length === 0
              ? "Nenhum participante cadastrado ainda."
              : "Nenhum resultado encontrado."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Participante</th>
                <th>E-mail</th>
                <th>Serviços solicitados</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const userReqs = requests.filter((r) => r.userId === u.id);
                const approved = userReqs.filter((r) => r.status === "aprovado");
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="person">
                        <div className="person-avatar">
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td><span className="contact">{u.email}</span></td>
                    <td>
                      {userReqs.length === 0 ? (
                        <span className="muted">Nenhum</span>
                      ) : (
                        <div className="service-tags">
                          {userReqs.map((r) => {
                            const svc = services.find((s) => s.id === r.serviceId);
                            return (
                              <span
                                key={r.id}
                                style={{ borderColor: svc?.color ?? "#999" }}
                              >
                                {r.serviceName}
                                {r.status === "solicitado" && " ⏳"}
                                {r.status === "aprovado" && " ✓"}
                                {r.status === "recusado" && " ✗"}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`tag-status ${approved.length > 0 ? "ativo" : "pendente"}`}>
                        {approved.length > 0 ? "Ativo" : "Pendente"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
