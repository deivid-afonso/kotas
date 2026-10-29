import { useState, useMemo } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { services } from "../data";
import { brl, formatDate } from "../utils";
import { AddServiceModal } from "../components/AddServiceModal";

export default function Services() {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = useMemo(
    () => services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTÃO</p>
          <h1>Serviços</h1>
          <p className="muted">Controle suas assinaturas e referências de ocupação.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          <Plus size={17} /> Adicionar serviço
        </button>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Buscar serviço..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar serviço"
          />
        </div>
        <button className="filter-btn">
          Todos os serviços <ChevronDown size={15} />
        </button>
      </div>
      <div className="service-cards">
        {filtered.map((s) => (
          <div className="service-card panel" key={s.id}>
            <div className="service-card-top">
              <div className="service-logo large" style={{ background: s.color }}>
                {s.name[0]}
              </div>
              <div>
                <h2>{s.name}</h2>
                <p>{s.plan}</p>
              </div>
              <button className="more-btn" aria-label={`Opções de ${s.name}`}>
                <MoreHorizontal />
              </button>
            </div>
            <div className="service-finance">
              <div>
                <small>Anuidade contratada</small>
                <strong>{brl(s.annualValue)}</strong>
              </div>
              <div>
                <small>Cobrança individual</small>
                <strong>{brl(s.chargeValue)}</strong>
              </div>
            </div>
            <div className="service-meta">
              <span>
                <CalendarDays size={15} /> Renova em <b>{formatDate(s.renewsAt)}</b>
              </span>
              <span>
                <Users size={15} />{" "}
                <b>
                  {s.participants}/{s.seats}
                </b>{" "}
                participantes
              </span>
            </div>
            {s.participants > s.seats && (
              <div className="warning-note">
                <AlertCircle size={15} /> Acima da referência de vagas
              </div>
            )}
            <div className="service-card-footer">
              <span>Custo por participante ativo</span>
              <b>{s.participants > 0 ? brl(s.annualValue / s.participants) : "—"}</b>
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddServiceModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
