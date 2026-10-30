import { Check, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusPill } from "../components/StatusPill";
import { listAllRequests, updateRequestStatus, type ServiceRequest } from "../api/requests";
import { ApiError } from "../api/client";

export default function Requests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listAllRequests()
      .then((r) => { if (!cancelled) setRequests(r); })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : "Erro ao carregar."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const pending = requests.filter((r) => r.status === "solicitado").length;

  const handleAction = async (id: number, status: "aprovado" | "recusado") => {
    try {
      await updateRequestStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erro ao atualizar.");
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PARTICIPAÇÃO</p>
          <h1>Solicitações</h1>
          <p className="muted">Aprove ou recuse pedidos de acesso aos serviços.</p>
        </div>
        <span className="info-chip">
          <Users size={15} /> {pending} aguardando análise
        </span>
      </div>
      {error && <div className="login-error" role="alert" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="panel table-wrap">
        {loading ? (
          <p className="muted" style={{ textAlign: "center", padding: 40 }}>Carregando...</p>
        ) : requests.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: 40 }}>
            Nenhuma solicitação recebida ainda.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Solicitante</th>
                <th>Serviço</th>
                <th>Data do pedido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="person">
                      <div className="person-avatar">
                        {(r.user_name ?? "?").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <strong>{r.user_name}</strong>
                        <small>{r.user_email}</small>
                      </div>
                    </div>
                  </td>
                  <td><b>{r.service_name}</b></td>
                  <td>{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td>
                    {r.status === "solicitado" ? (
                      <div className="row-actions">
                        <button className="approve" onClick={() => handleAction(r.id, "aprovado")}>
                          <Check size={14} /> Aprovar
                        </button>
                        <button className="reject" onClick={() => handleAction(r.id, "recusado")}>
                          <X size={14} /> Recusar
                        </button>
                      </div>
                    ) : (
                      <span className="muted">{r.status === "aprovado" ? "Aprovado" : "Recusado"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
