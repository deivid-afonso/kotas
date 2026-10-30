import { CalendarDays, Check, CircleDollarSign, Clock, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { services } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";
import { listMyRequests, type ServiceRequest } from "../api/requests";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyRequests()
      .then(setRequests)
      .catch(() => { /* ok */ })
      .finally(() => setLoading(false));
  }, []);

  const approved = requests.filter((r) => r.status === "aprovado");
  const pending = requests.filter((r) => r.status === "solicitado");
  const myServices = approved
    .map((r) => services.find((s) => s.id === r.service_id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const totalAnnual = myServices.reduce((sum, s) => sum + s.chargeValue, 0);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MEU PAINEL</p>
          <h1>Olá, {user?.name.split(" ")[0]} <span>👋</span></h1>
          <p className="muted">Aqui está o resumo das suas assinaturas.</p>
        </div>
      </div>

      <section className="metric-grid" aria-label="Resumo pessoal">
        <Metric
          label="Serviços ativos"
          value={String(myServices.length)}
          detail={myServices.length > 0 ? myServices.map((s) => s.name).join(", ") : "Nenhum ainda"}
          tone="blue"
          icon={CircleDollarSign}
        />
        <Metric
          label="Total anual"
          value={brl(totalAnnual)}
          detail={myServices.length > 0 ? "Soma das assinaturas aprovadas" : "Sem valores"}
          tone="green"
          icon={Check}
        />
        <Metric
          label="Aguardando aprovação"
          value={String(pending.length)}
          detail={pending.length > 0 ? "Em análise pelo admin" : "Nenhum pedido pendente"}
          tone={pending.length > 0 ? "yellow" : "green"}
          icon={WalletCards}
        />
        <Metric
          label="Pedidos totais"
          value={String(requests.length)}
          detail="Histórico de solicitações"
          tone="blue"
          icon={CalendarDays}
        />
      </section>

      <div className="content-grid">
        <section className="panel" style={{ padding: "21px 22px" }}>
          <div className="panel-header">
            <div>
              <h2>Meus serviços</h2>
              <p>Assinaturas aprovadas em que você participa</p>
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
            {myServices.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <p className="muted">Você ainda não participa de nenhum serviço.</p>
                <button className="primary-btn" style={{ marginTop: 16 }} onClick={() => navigate("/services")}>
                  Explorar serviços disponíveis
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <h2>Minhas solicitações</h2>
              <p>Histórico de pedidos</p>
            </div>
          </div>
          {requests.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: 40 }}>
              {loading ? "Carregando..." : "Nenhuma solicitação enviada."}
            </p>
          ) : (
            requests.map((r) => (
              <div className="alert-item" key={r.id}>
                <div className={`alert-symbol ${r.status === "aprovado" ? "blue" : r.status === "recusado" ? "red" : "yellow"}`}>
                  {r.status === "aprovado" ? <Check size={16} /> : r.status === "recusado" ? <X size={16} /> : <Clock size={16} />}
                </div>
                <div>
                  <strong>{r.service_name}</strong>
                  <p>
                    {r.status === "aprovado" ? "Aprovado" : r.status === "recusado" ? "Recusado" : "Aguardando aprovação"}
                    {" · "}
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
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
