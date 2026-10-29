import { AlertCircle, CalendarDays, Check, CircleDollarSign, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { charges, participants, services } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const participant = participants.find((p) => p.id === user?.participantId);
  const myCharges = charges.filter((c) => c.participantId === user?.participantId);
  const myServices = participant ? participant.services.map((id) => services[id - 1]) : [];

  const total = myCharges.reduce(
    (sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0),
    0,
  );
  const paid = myCharges
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0), 0);
  const pending = total - paid;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MEU PAINEL</p>
          <h1>Olá, {user?.name.split(" ")[0]} <span>👋</span></h1>
          <p className="muted">Aqui está o resumo das suas assinaturas anuais.</p>
        </div>
      </div>

      <section className="metric-grid" aria-label="Resumo pessoal">
        <Metric
          label="Total anual"
          value={brl(total)}
          detail={`${myCharges.length} cobrança${myCharges.length > 1 ? "s" : ""}`}
          tone="blue"
          icon={CircleDollarSign}
        />
        <Metric
          label="Pago"
          value={brl(paid)}
          detail={paid > 0 ? "Em dia" : "Nenhum pagamento"}
          tone="green"
          icon={Check}
        />
        <Metric
          label="Pendente"
          value={brl(pending)}
          detail={pending > 0 ? "Aguardando pagamento" : "Tudo pago"}
          tone={pending > 0 ? "yellow" : "green"}
          icon={WalletCards}
        />
        <Metric
          label="Serviços ativos"
          value={String(myServices.length)}
          detail={myServices.map((s) => s.name).join(", ")}
          tone="blue"
          icon={CalendarDays}
        />
      </section>

      <div className="content-grid">
        <section className="panel" style={{ padding: "21px 22px" }}>
          <div className="panel-header">
            <div>
              <h2>Meus serviços</h2>
              <p>Assinaturas anuais em que você participa</p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {myServices.map((s) => (
              <div className="renewal" key={s.id}>
                <div className="service-logo" style={{ background: s.color }}>{s.name[0]}</div>
                <div>
                  <strong>{s.name}</strong>
                  <small>{s.plan}</small>
                </div>
                <div className="renewal-date">
                  <strong>{brl(s.chargeValue)}</strong>
                  <small>Renova {formatDate(s.renewsAt)}</small>
                </div>
              </div>
            ))}
            {myServices.length === 0 && (
              <p className="muted" style={{ textAlign: "center", padding: 40 }}>
                Você ainda não participa de nenhum serviço.
              </p>
            )}
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <h2>Cobranças recentes</h2>
              <p>Seu histórico de pagamentos</p>
            </div>
            <button className="link-btn" onClick={() => navigate("/charges")}>Ver todas</button>
          </div>
          {myCharges.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: 40 }}>
              Nenhuma cobrança registrada.
            </p>
          ) : (
            myCharges.map((c) => (
              <div className="alert-item" key={c.id}>
                <div className={`alert-symbol ${c.status === "pago" ? "blue" : c.status === "vencido" ? "red" : "yellow"}`}>
                  {c.status === "pago" ? <Check size={16} /> : c.status === "vencido" ? <AlertCircle size={16} /> : <WalletCards size={16} />}
                </div>
                <div>
                  <strong>
                    {brl(c.services.reduce((sum, s) => sum + s.value + s.adjustment, 0))} — {c.reference}
                  </strong>
                  <p>
                    {c.status === "pago" ? "Pago" : c.status === "vencido" ? "Vencido" : "Pendente"} · Vence {formatDate(c.dueDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
