import { useState } from "react";
import { ChevronDown, MoreHorizontal, Plus, Search } from "lucide-react";
import { participants, services } from "../data";
import { brl } from "../utils";

export default function Participants() {
  const [query, setQuery] = useState("");
  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTÃO</p>
          <h1>Participantes</h1>
          <p className="muted">Gerencie pessoas e seus serviços anuais.</p>
        </div>
        <button className="primary-btn">
          <Plus size={17} /> Novo participante
        </button>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Buscar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar participante"
          />
        </div>
        <button className="filter-btn">
          Ativos <ChevronDown size={15} />
        </button>
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Participante</th>
              <th>Contato</th>
              <th>Serviços ativos</th>
              <th>Total anual</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="person">
                    <div className="person-avatar">
                      {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="contact">
                    {p.email}
                    <br />
                    {p.phone}
                  </span>
                </td>
                <td>
                  <div className="service-tags">
                    {p.services.map((id) => (
                      <span key={id} style={{ borderColor: services[id - 1].color }}>
                        {services[id - 1].name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <b>{brl(p.total)}</b>
                </td>
                <td>
                  <span className={`tag-status ${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  <button className="more-btn" aria-label={`Opções de ${p.name}`}>
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
