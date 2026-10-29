import { Check, Users, X } from "lucide-react";
import { StatusPill } from "../components/StatusPill";

const rows = [
  { name: "Ana Beatriz", email: "ana@email.com", service: "Max", date: "28/05/2025", status: "solicitado" },
  { name: "Pedro Henrique", email: "pedro@email.com", service: "Netflix", date: "27/05/2025", status: "solicitado" },
  { name: "Marcos Lima", email: "marcos@email.com", service: "Spotify", date: "25/05/2025", status: "aprovado" },
];

export default function Requests() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PARTICIPAÇÃO</p>
          <h1>Solicitações</h1>
          <p className="muted">Aprove ou recuse pedidos de acesso aos serviços.</p>
        </div>
        <span className="info-chip">
          <Users size={15} /> 3 aguardando análise
        </span>
      </div>
      <div className="panel table-wrap">
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
            {rows.map((r) => (
              <tr key={r.name}>
                <td>
                  <div className="person">
                    <div className="person-avatar">
                      {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <strong>{r.name}</strong>
                      <small>{r.email}</small>
                    </div>
                  </div>
                </td>
                <td><b>{r.service}</b></td>
                <td>{r.date}</td>
                <td><StatusPill status={r.status} /></td>
                <td>
                  {r.status === "solicitado" ? (
                    <div className="row-actions">
                      <button className="approve"><Check size={14} /> Aprovar</button>
                      <button className="reject"><X size={14} /> Recusar</button>
                    </div>
                  ) : (
                    <span className="muted">Aprovado manualmente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
