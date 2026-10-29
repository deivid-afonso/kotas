import { Check, CircleDollarSign, WalletCards } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { charges } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";
import { StatusPill } from "../components/StatusPill";

export default function UserCharges() {
  const { user } = useAuth();
  const myCharges = charges.filter((c) => c.participantId === user?.participantId);

  const total = myCharges.reduce(
    (sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0),
    0,
  );
  const paid = myCharges
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0), 0);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCEIRO</p>
          <h1>Minhas cobranças</h1>
          <p className="muted">Acompanhe suas cobranças anuais consolidadas.</p>
        </div>
      </div>

      <div className="metric-grid compact" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <Metric label="Total" value={brl(total)} detail={`${myCharges.length} cobrança${myCharges.length > 1 ? "s" : ""}`} tone="blue" icon={WalletCards} />
        <Metric label="Pago" value={brl(paid)} detail={paid > 0 ? "Confirmado" : "—"} tone="green" icon={Check} />
        <Metric label="Pendente" value={brl(total - paid)} detail={total - paid > 0 ? "Aguardando" : "Nada pendente"} tone={total - paid > 0 ? "yellow" : "green"} icon={CircleDollarSign} />
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Referência</th>
              <th>Serviços</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myCharges.map((c) => (
              <tr key={c.id}>
                <td><b>{c.reference}</b></td>
                <td>
                  <div className="service-tags">
                    {c.services.map((s) => (
                      <span key={s.name}>{s.name}</span>
                    ))}
                  </div>
                </td>
                <td>{formatDate(c.dueDate)}</td>
                <td><b>{brl(c.services.reduce((sum, s) => sum + s.value + s.adjustment, 0))}</b></td>
                <td><StatusPill status={c.status} /></td>
              </tr>
            ))}
            {myCharges.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                  <span className="muted">Nenhuma cobrança encontrada.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
