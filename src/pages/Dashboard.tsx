import {
  AlertCircle,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Plus,
  Users,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { charges, services } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";

export default function Dashboard() {
  const navigate = useNavigate();
  const total = charges.reduce(
    (sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0),
    0,
  );
  const paid = charges
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0), 0);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">QUINTA-FEIRA, 29 DE MAIO DE 2025</p>
          <h1>
            Bom dia, Admin <span>👋</span>
          </h1>
          <p className="muted">Aqui está o resumo das suas assinaturas.</p>
        </div>
        <button className="primary-btn" onClick={() => navigate("/charges")}>
          <Plus size={17} /> Nova cobrança
        </button>
      </div>

      <section className="metric-grid" aria-label="Indicadores financeiros">
        <Metric label="Total anual previsto" value={brl(total)} detail="+12,5% vs. ano anterior" tone="blue" icon={CircleDollarSign} />
        <Metric label="Total recebido" value={brl(paid)} detail={`${Math.round((paid / total) * 100)}% do previsto`} tone="green" icon={Check} />
        <Metric label="Total pendente" value={brl(total - paid)} detail="2 cobranças aguardando" tone="yellow" icon={WalletCards} />
        <Metric label="Em atraso" value={brl(399.2)} detail="2 cobranças vencidas" tone="red" icon={AlertCircle} />
      </section>

      <div className="content-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Visão financeira</h2>
              <p>Recebimentos e custos por ano</p>
            </div>
            <button className="select-btn">
              2025 <ChevronDown size={15} />
            </button>
          </div>
          <div className="chart-legend">
            <span><i className="dot blue" /> Recebido</span>
            <span><i className="dot light-blue" /> Previsto</span>
          </div>
          <div className="bar-chart" role="img" aria-label="Gráfico de recebimentos mensais">
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((month, i) => (
              <div className="bar-col" key={month}>
                <div className="bars">
                  <span style={{ height: `${[55, 75, 58, 86, 45, 28, 20, 20, 20, 20, 20, 20][i]}%` }} />
                  <span style={{ height: `${[72, 85, 72, 96, 65, 50, 42, 42, 42, 42, 42, 42][i]}%` }} />
                </div>
                <small>{month}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel renewal-panel">
          <div className="panel-header">
            <div>
              <h2>Próximas renovações</h2>
              <p>Nos próximos 90 dias</p>
            </div>
            <button className="link-btn" onClick={() => navigate("/services")}>Ver todas</button>
          </div>
          {services.slice(0, 3).map((s) => (
            <div className="renewal" key={s.id}>
              <div className="service-logo" style={{ background: s.color }}>{s.name[0]}</div>
              <div>
                <strong>{s.name}</strong>
                <small>{s.plan}</small>
              </div>
              <div className="renewal-date">
                <strong>{formatDate(s.renewsAt)}</strong>
                <small>em {s.id === 1 ? 12 : s.id === 2 ? 35 : 68} dias</small>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="content-grid bottom-grid">
        <section className="panel" style={{ padding: "21px 22px" }}>
          <div className="panel-header">
            <div>
              <h2>Ocupação por serviço</h2>
              <p>Participantes ativos e vagas de referência</p>
            </div>
            <button className="link-btn" onClick={() => navigate("/services")}>Gerenciar</button>
          </div>
          <div className="occupancy-list">
            {services.map((s) => (
              <div className="occupancy" key={s.id}>
                <div className="occ-title">
                  <span className="mini-logo" style={{ background: s.color }}>{s.name[0]}</span>
                  <strong>{s.name}</strong>
                  <span className={s.participants > s.seats ? "over" : "within"}>
                    {s.participants > s.seats ? "Acima da referência" : "Dentro da referência"}
                  </span>
                  <b>{s.participants}/{s.seats}</b>
                </div>
                <div className="progress" role="progressbar" aria-valuenow={s.participants} aria-valuemax={s.seats} aria-label={`Ocupação ${s.name}`}>
                  <span style={{ width: `${Math.min((s.participants / s.seats) * 100, 100)}%`, background: s.participants > s.seats ? "#f59e0b" : s.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <h2>Alertas recentes</h2>
              <p>Ações que precisam da sua atenção</p>
            </div>
            <span className="alert-count">3</span>
          </div>
          <div className="alert-item">
            <div className="alert-symbol yellow"><Bell size={16} /></div>
            <div>
              <strong>2 pagamentos pendentes</strong>
              <p>Envie um lembrete aos participantes</p>
            </div>
            <button onClick={() => navigate("/charges")} aria-label="Ver cobranças"><ChevronDown size={16} /></button>
          </div>
          <div className="alert-item">
            <div className="alert-symbol red"><CalendarDays size={16} /></div>
            <div>
              <strong>Netflix renova em 12 dias</strong>
              <p>Confira o valor da próxima anuidade</p>
            </div>
            <button onClick={() => navigate("/services")} aria-label="Ver serviços"><ChevronDown size={16} /></button>
          </div>
          <div className="alert-item">
            <div className="alert-symbol blue"><Users size={16} /></div>
            <div>
              <strong>Max acima da referência</strong>
              <p>4 participantes para 3 vagas</p>
            </div>
            <button onClick={() => navigate("/services")} aria-label="Ver serviços"><ChevronDown size={16} /></button>
          </div>
        </section>
      </div>
    </>
  );
}
