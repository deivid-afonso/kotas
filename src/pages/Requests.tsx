import { Check, Users, X } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "../components/StatusPill";
import { getRequests, updateRequestStatus, type ServiceRequest } from "../stores/serviceRequests";
import { formatDate } from "../utils";

export default function Requests() {
  const [requests, setRequests] = useState<ServiceRequest[]>(getRequests);

  const pending = requests.filter((r) => r.status === "solicitado").length;

  const handleAction = (id: number, status: "aprovado" | "recusado") => {
    updateRequestStatus(id, status);
    setRequests(getRequests());
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
      <div className="panel table-wrap">
        {requests.length === 0 ? (
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
                        {r.userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <strong>{r.userName}</strong>
                        <small>{r.userEmail}</small>
                      </div>
                    </div>
                  </td>
                  <td><b>{r.serviceName}</b></td>
                  <td>{formatDate(r.date)}</td>
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
