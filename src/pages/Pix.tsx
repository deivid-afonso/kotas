import { Settings, Zap } from "lucide-react";

export default function Pix() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCEIRO</p>
          <h1>Pagamentos PIX</h1>
          <p className="muted">Acompanhe as confirmações do seu gateway.</p>
        </div>
        <button className="secondary-btn">
          <Settings size={16} /> Configurar gateway
        </button>
      </div>
      <div className="pix-card panel">
        <div className="pix-card-icon">
          <Zap size={24} />
        </div>
        <div>
          <h2>Gateway PIX conectado</h2>
          <p>Asaas · Última sincronização hoje às 09:42</p>
        </div>
        <span className="connected">
          <i /> Conectado
        </span>
      </div>
      <div className="panel pix-empty">
        <div className="empty-icon">
          <Zap size={25} />
        </div>
        <h2>Todos os pagamentos estão sincronizados</h2>
        <p>Quando novas cobranças forem pagas, elas aparecerão aqui automaticamente.</p>
      </div>
    </>
  );
}
