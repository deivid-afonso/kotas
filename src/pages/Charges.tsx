import {
  AlertCircle,
  Check,
  ChevronDown,
  CircleDollarSign,
  MoreHorizontal,
  Plus,
  Search,
  WalletCards,
} from "lucide-react";
import { charges } from "../data";
import { brl, formatDate } from "../utils";
import { Metric } from "../components/Metric";
import { StatusPill } from "../components/StatusPill";

export default function Charges() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCEIRO</p>
          <h1>Cobranças anuais</h1>
          <p className="muted">Uma cobrança PIX consolidada por participante e ciclo.</p>
        </div>
        <button className="primary-btn">
          <Plus size={17} /> Gerar cobranças
        </button>
      </div>
      <div className="metric-grid compact" aria-label="Resumo de cobranças">
        <Metric label="Total em cobranças" value={brl(1308.8)} detail="5 cobranças no ciclo 2025" tone="blue" icon={WalletCards} />
        <Metric label="Recebido" value={brl(739.4)} detail="2 cobranças pagas" tone="green" icon={Check} />
        <Metric label="Aguardando" value={brl(399.2)} detail="2 cobranças pendentes" tone="yellow" icon={CircleDollarSign} />
        <Metric label="Vencido" value={brl(399.2)} detail="Ação necessária" tone="red" icon={AlertCircle} />
      </div>
      <div className="panel table-wrap">
        <div className="table-heading">
          <div className="search">
            <Search size={17} />
            <input placeholder="Buscar cobrança..." aria-label="Buscar cobrança" />
          </div>
          <button className="filter-btn">
            Todos os status <ChevronDown size={15} />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Participante</th>
              <th>Referência</th>
              <th>Serviços</th>
              <th>Vencimento</th>
              <th>Valor total</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {charges.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="person">
                    <div className="person-avatar">
                      {c.participant.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <strong>{c.participant}</strong>
                  </div>
                </td>
                <td>{c.reference}</td>
                <td>
                  <span className="service-count">
                    {c.services.length} serviço{c.services.length > 1 ? "s" : ""}
                  </span>
                </td>
                <td>{formatDate(c.dueDate)}</td>
                <td>
                  <b>{brl(c.services.reduce((sum, s) => sum + s.value + s.adjustment, 0))}</b>
                </td>
                <td><StatusPill status={c.status} /></td>
                <td>
                  <button className="more-btn" aria-label={`Opções da cobrança de ${c.participant}`}>
                    <MoreHorizontal />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
