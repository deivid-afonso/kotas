import { ArrowDownToLine, FileBarChart } from "lucide-react";

const reports = [
  { title: "Resumo por serviço", desc: "Custos, margem e recebimentos anuais" },
  { title: "Resumo por participante", desc: "Histórico de serviços e pagamentos" },
  { title: "Cobranças PIX", desc: "Pendentes, vencidas e pagas" },
  { title: "Ocupação acima da referência", desc: "Serviços que excederam as vagas" },
];

export default function Reports() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ANÁLISES</p>
          <h1>Relatórios</h1>
          <p className="muted">Dados financeiros para acompanhar seu negócio.</p>
        </div>
        <button className="secondary-btn">
          <ArrowDownToLine size={16} /> Exportar relatório
        </button>
      </div>
      <div className="report-grid">
        {reports.map((r) => (
          <div className="report-card panel" key={r.title}>
            <div className="report-icon">
              <FileBarChart size={20} />
            </div>
            <h2>{r.title}</h2>
            <p>{r.desc}</p>
            <button className="link-btn">Abrir relatório →</button>
          </div>
        ))}
      </div>
    </>
  );
}
