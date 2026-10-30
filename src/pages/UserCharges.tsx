import { Check, CircleDollarSign, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { services } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";
import { listMyRequests, type ServiceRequest } from "../api/requests";

export default function UserCharges() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyRequests()
      .then(setRequests)
      .catch(() => { /* ok */ })
      .finally(() => setLoading(false));
  }, []);

  const approved = requests.filter((r) => r.status === "aprovado");
  const myServices = approved
    .map((r) => services.find((s) => s.id === r.service_id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const total = myServices.reduce((sum, s) => sum + s.chargeValue, 0);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCEIRO</p>
          <h1>Minhas cobranças</h1>
          <p className="muted">Valores anuais das assinaturas aprovadas.</p>
        </div>
      </div>

      <div className="metric-grid compact" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <Metric label="Serviços ativos" value={String(myServices.length)} detail={myServices.length > 0 ? "Aprovados pelo admin" : "Nenhum ainda"} tone="blue" icon={WalletCards} />
        <Metric label="Total anual" value={brl(total)} detail={total > 0 ? "Soma das cotas" : "—"} tone="green" icon={Check} />
        <Metric label="Média mensal" value={brl(total / 12)} detail="Valor estimado" tone="yellow" icon={CircleDollarSign} />
      </div>

      <div className="panel table-wrap">
        {loading ? (
          <p className="muted" style={{ textAlign: "center", padding: 40 }}>Carregando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Plano</th>
                <th>Renovação</th>
                <th>Valor anual</th>
              </tr>
            </thead>
            <tbody>
              {myServices.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="person">
                      <div className="service-logo" style={{ background: s.color }}>{s.name[0]}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.plan}</td>
                  <td>{formatDate(s.renewsAt)}</td>
                  <td><b>{brl(s.chargeValue)}</b></td>
                </tr>
              ))}
              {myServices.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                    <span className="muted">Você ainda não tem assinaturas aprovadas.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
