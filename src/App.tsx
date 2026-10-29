import { useMemo, useState } from "react";
import {
  AlertCircle, ArrowDownToLine, Bell, CalendarDays, Check, ChevronDown, CircleDollarSign,
  CreditCard, FileBarChart, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings,
  Users, WalletCards, X, Zap, Moon, Sun
} from "lucide-react";
import { charges, participants, services } from "./data";
import { AnnualCharge, Service } from "./types";

type View = "dashboard" | "services" | "participants" | "requests" | "charges" | "pix" | "reports" | "settings";

const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const date = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "services", label: "Serviços", icon: CreditCard },
  { id: "participants", label: "Participantes", icon: Users },
  { id: "requests", label: "Solicitações", icon: Bell, badge: 3 },
  { id: "charges", label: "Cobranças anuais", icon: WalletCards },
  { id: "pix", label: "Pagamentos PIX", icon: Zap },
  { id: "reports", label: "Relatórios", icon: FileBarChart },
];

function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill ${status}`}>{status === "pago" ? "Pago" : status === "pendente" ? "Pendente" : status === "vencido" ? "Vencido" : status}</span>;
}

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("assina-theme") !== "light");

  const pageTitle = nav.find((item) => item.id === view)?.label ?? "Dashboard";
  const filteredServices = useMemo(() => services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())), [query]);

  const navigate = (next: View) => { setView(next); setMobileOpen(false); setQuery(""); };
  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      localStorage.setItem("assina-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>assina<span className="brand-dot">.</span></span></div>
        <div className="workspace"><div className="avatar">AC</div><div><strong>Admin Costa</strong><small>Administrador</small></div><ChevronDown size={15} /></div>
        <nav>{nav.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id as View)}><Icon size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>; })}</nav>
        <div className="sidebar-bottom"><button onClick={() => navigate("settings")}><Settings size={18} /> Configurações</button><div className="help-card"><div className="help-icon">?</div><strong>Precisa de ajuda?</strong><span>Veja como funciona</span></div></div>
      </aside>
      {mobileOpen && <button className="backdrop" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}
      <main className="main-content">
        <header className="topbar"><button className="menu-toggle" onClick={() => setMobileOpen(true)}><Menu /></button><div className="breadcrumb"><span>Visão geral</span><strong>/</strong><b>{pageTitle}</b></div><div className="top-actions"><button className="icon-btn theme-toggle" onClick={toggleTheme} title={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-btn"><Bell size={19} /><i /></button><div className="top-avatar">AC</div></div></header>
        <div className="page-content">
          {view === "dashboard" && <Dashboard onNavigate={navigate} />}
          {view === "services" && <Services query={query} setQuery={setQuery} onAdd={() => setShowAdd(true)} services={filteredServices} />}
          {view === "participants" && <Participants query={query} setQuery={setQuery} />}
          {view === "requests" && <Requests />}
          {view === "charges" && <Charges />}
          {view === "pix" && <Pix />}
          {view === "reports" && <Reports />}
          {view === "settings" && <SettingsPage darkMode={darkMode} onToggleTheme={toggleTheme} />}
        </div>
      </main>
      {showAdd && <AddService onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (view: View) => void }) {
  const total = charges.reduce((sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0), 0);
  const paid = charges.filter((c) => c.status === "pago").reduce((sum, c) => sum + c.services.reduce((s, item) => s + item.value + item.adjustment, 0), 0);
  return <><div className="page-heading"><div><p className="eyebrow">QUINTA-FEIRA, 29 DE MAIO DE 2025</p><h1>Bom dia, Admin <span>👋</span></h1><p className="muted">Aqui está o resumo das suas assinaturas.</p></div><button className="primary-btn" onClick={() => onNavigate("charges")}><Plus size={17} /> Nova cobrança</button></div>
    <section className="metric-grid"><Metric label="Total anual previsto" value={brl(total)} detail="+12,5% vs. ano anterior" tone="blue" icon={CircleDollarSign} /><Metric label="Total recebido" value={brl(paid)} detail={`${Math.round(paid / total * 100)}% do previsto`} tone="green" icon={Check} /><Metric label="Total pendente" value={brl(total - paid)} detail="2 cobranças aguardando" tone="yellow" icon={WalletCards} /><Metric label="Em atraso" value={brl(399.2)} detail="2 cobranças vencidas" tone="red" icon={AlertCircle} /></section>
    <div className="content-grid"><section className="panel chart-panel"><div className="panel-header"><div><h2>Visão financeira</h2><p>Recebimentos e custos por ano</p></div><button className="select-btn">2025 <ChevronDown size={15} /></button></div><div className="chart-legend"><span><i className="dot blue" /> Recebido</span><span><i className="dot light-blue" /> Previsto</span></div><div className="bar-chart">{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((month, i) => <div className="bar-col" key={month}><div className="bars"><span style={{ height: `${[55, 75, 58, 86, 45, 28, 20, 20, 20, 20, 20, 20][i]}%` }} /><span style={{ height: `${[72, 85, 72, 96, 65, 50, 42, 42, 42, 42, 42, 42][i]}%` }} /></div><small>{month}</small></div>)}</div></section>
      <section className="panel renewal-panel"><div className="panel-header"><div><h2>Próximas renovações</h2><p>Nos próximos 90 dias</p></div><button className="link-btn" onClick={() => onNavigate("services")}>Ver todas</button></div>{services.slice(0, 3).map((s) => <div className="renewal" key={s.id}><div className="service-logo" style={{ background: s.color }}>{s.name[0]}</div><div><strong>{s.name}</strong><small>{s.plan}</small></div><div className="renewal-date"><strong>{date(s.renewsAt)}</strong><small>em {s.id === 1 ? 12 : s.id === 2 ? 35 : 68} dias</small></div></div>)}</section></div>
    <div className="content-grid bottom-grid"><section className="panel"><div className="panel-header"><div><h2>Ocupação por serviço</h2><p>Participantes ativos e vagas de referência</p></div><button className="link-btn" onClick={() => onNavigate("services")}>Gerenciar</button></div><div className="occupancy-list">{services.map((s) => <div className="occupancy" key={s.id}><div className="occ-title"><span className="mini-logo" style={{ background: s.color }}>{s.name[0]}</span><strong>{s.name}</strong><span className={s.participants > s.seats ? "over" : "within"}>{s.participants > s.seats ? "Acima da referência" : "Dentro da referência"}</span><b>{s.participants}/{s.seats}</b></div><div className="progress"><span style={{ width: `${Math.min(s.participants / s.seats * 100, 100)}%`, background: s.participants > s.seats ? "#f59e0b" : s.color }} /></div></div>)}</div></section><section className="panel alerts-panel"><div className="panel-header"><div><h2>Alertas recentes</h2><p>Ações que precisam da sua atenção</p></div><span className="alert-count">3</span></div><div className="alert-item"><div className="alert-symbol yellow"><Bell size={16} /></div><div><strong>2 pagamentos pendentes</strong><p>Envie um lembrete aos participantes</p></div><button onClick={() => onNavigate("charges")}><ChevronDown size={16} /></button></div><div className="alert-item"><div className="alert-symbol red"><CalendarDays size={16} /></div><div><strong>Netflix renova em 12 dias</strong><p>Confira o valor da próxima anuidade</p></div><button onClick={() => onNavigate("services")}><ChevronDown size={16} /></button></div><div className="alert-item"><div className="alert-symbol blue"><Users size={16} /></div><div><strong>Max acima da referência</strong><p>4 participantes para 3 vagas</p></div><button onClick={() => onNavigate("services")}><ChevronDown size={16} /></button></div></section></div>
  </>;
}

function Metric({ label, value, detail, tone, icon: Icon }: { label: string; value: string; detail: string; tone: string; icon: typeof CircleDollarSign }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19} /></div><p>{label}</p><strong>{value}</strong><small className={tone === "red" ? "negative" : "positive"}>{tone !== "red" && "↗ "}{detail}</small></div>; }

function Services({ services: list, query, setQuery, onAdd }: { services: Service[]; query: string; setQuery: (v: string) => void; onAdd: () => void }) { return <><div className="page-heading"><div><p className="eyebrow">GESTÃO</p><h1>Serviços</h1><p className="muted">Controle suas assinaturas e referências de ocupação.</p></div><button className="primary-btn" onClick={onAdd}><Plus size={17} /> Adicionar serviço</button></div><div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Buscar serviço..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><button className="filter-btn">Todos os serviços <ChevronDown size={15} /></button></div><div className="service-cards">{list.map((s) => <div className="service-card panel" key={s.id}><div className="service-card-top"><div className="service-logo large" style={{ background: s.color }}>{s.name[0]}</div><div><h2>{s.name}</h2><p>{s.plan}</p></div><button className="more-btn"><MoreHorizontal /></button></div><div className="service-finance"><div><small>Anuidade contratada</small><strong>{brl(s.annualValue)}</strong></div><div><small>Cobrança individual</small><strong>{brl(s.chargeValue)}</strong></div></div><div className="service-meta"><span><CalendarDays size={15} /> Renova em <b>{date(s.renewsAt)}</b></span><span><Users size={15} /> <b>{s.participants}/{s.seats}</b> participantes</span></div>{s.participants > s.seats && <div className="warning-note"><AlertCircle size={15} /> Acima da referência de vagas</div>}<div className="service-card-footer"><span>Custo por participante ativo</span><b>{brl(s.annualValue / s.participants)}</b></div></div>)}</div></>; }

function Participants({ query, setQuery }: { query: string; setQuery: (v: string) => void }) { return <><div className="page-heading"><div><p className="eyebrow">GESTÃO</p><h1>Participantes</h1><p className="muted">Gerencie pessoas e seus serviços anuais.</p></div><button className="primary-btn"><Plus size={17} /> Novo participante</button></div><div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Buscar por nome ou e-mail..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><button className="filter-btn">Ativos <ChevronDown size={15} /></button></div><div className="panel table-wrap"><table><thead><tr><th>Participante</th><th>Contato</th><th>Serviços ativos</th><th>Total anual</th><th>Status</th><th /></tr></thead><tbody>{participants.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).map((p) => <tr key={p.id}><td><div className="person"><div className="person-avatar">{p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><strong>{p.name}</strong></div></td><td><span className="contact">{p.email}<br />{p.phone}</span></td><td><div className="service-tags">{p.services.map((id) => <span key={id} style={{ borderColor: services[id - 1].color }}>{services[id - 1].name}</span>)}</div></td><td><b>{brl(p.total)}</b></td><td><span className={`tag-status ${p.status.toLowerCase()}`}>{p.status}</span></td><td><button className="more-btn"><MoreHorizontal /></button></td></tr>)}</tbody></table></div></>; }

function Requests() { const rows = [{ name: "Ana Beatriz", email: "ana@email.com", service: "Max", date: "28/05/2025", status: "solicitado" }, { name: "Pedro Henrique", email: "pedro@email.com", service: "Netflix", date: "27/05/2025", status: "solicitado" }, { name: "Marcos Lima", email: "marcos@email.com", service: "Spotify", date: "25/05/2025", status: "aprovado" }]; return <><div className="page-heading"><div><p className="eyebrow">PARTICIPAÇÃO</p><h1>Solicitações</h1><p className="muted">Aprove ou recuse pedidos de acesso aos serviços.</p></div><span className="info-chip"><Users size={15} /> 3 aguardando análise</span></div><div className="panel table-wrap"><table><thead><tr><th>Solicitante</th><th>Serviço</th><th>Data do pedido</th><th>Status</th><th>Ações</th></tr></thead><tbody>{rows.map((r) => <tr key={r.name}><td><div className="person"><div className="person-avatar">{r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div><strong>{r.name}</strong><small>{r.email}</small></div></div></td><td><b>{r.service}</b></td><td>{r.date}</td><td><StatusPill status={r.status} /></td><td>{r.status === "solicitado" ? <div className="row-actions"><button className="approve"><Check size={14} /> Aprovar</button><button className="reject"><X size={14} /> Recusar</button></div> : <span className="muted">Aprovado manualmente</span>}</td></tr>)}</tbody></table></div></>; }

function Charges() { return <><div className="page-heading"><div><p className="eyebrow">FINANCEIRO</p><h1>Cobranças anuais</h1><p className="muted">Uma cobrança PIX consolidada por participante e ciclo.</p></div><button className="primary-btn"><Plus size={17} /> Gerar cobranças</button></div><div className="metric-grid compact"><Metric label="Total em cobranças" value={brl(1308.8)} detail="5 cobranças no ciclo 2025" tone="blue" icon={WalletCards} /><Metric label="Recebido" value={brl(739.4)} detail="2 cobranças pagas" tone="green" icon={Check} /><Metric label="Aguardando" value={brl(399.2)} detail="2 cobranças pendentes" tone="yellow" icon={CircleDollarSign} /><Metric label="Vencido" value={brl(399.2)} detail="Ação necessária" tone="red" icon={AlertCircle} /></div><div className="panel table-wrap"><div className="table-heading"><div className="search"><Search size={17} /><input placeholder="Buscar cobrança..." /></div><button className="filter-btn">Todos os status <ChevronDown size={15} /></button></div><table><thead><tr><th>Participante</th><th>Referência</th><th>Serviços</th><th>Vencimento</th><th>Valor total</th><th>Status</th><th /></tr></thead><tbody>{charges.map((c) => <tr key={c.id}><td><div className="person"><div className="person-avatar">{c.participant.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><strong>{c.participant}</strong></div></td><td>{c.reference}</td><td><span className="service-count">{c.services.length} serviço{c.services.length > 1 ? "s" : ""}</span></td><td>{date(c.dueDate)}</td><td><b>{brl(c.services.reduce((sum, s) => sum + s.value + s.adjustment, 0))}</b></td><td><StatusPill status={c.status} /></td><td><button className="more-btn"><MoreHorizontal /></button></td></tr>)}</tbody></table></div></>; }

function Pix() { return <><div className="page-heading"><div><p className="eyebrow">FINANCEIRO</p><h1>Pagamentos PIX</h1><p className="muted">Acompanhe as confirmações do seu gateway.</p></div><button className="secondary-btn"><Settings size={16} /> Configurar gateway</button></div><div className="pix-card panel"><div className="pix-card-icon"><Zap size={24} /></div><div><h2>Gateway PIX conectado</h2><p>Asaas · Última sincronização hoje às 09:42</p></div><span className="connected"><i /> Conectado</span></div><div className="panel pix-empty"><div className="empty-icon"><Zap size={25} /></div><h2>Todos os pagamentos estão sincronizados</h2><p>Quando novas cobranças forem pagas, elas aparecerão aqui automaticamente.</p></div></>; }

function Reports() { return <><div className="page-heading"><div><p className="eyebrow">ANÁLISES</p><h1>Relatórios</h1><p className="muted">Dados financeiros para acompanhar seu negócio.</p></div><button className="secondary-btn"><ArrowDownToLine size={16} /> Exportar relatório</button></div><div className="report-grid">{["Resumo por serviço", "Resumo por participante", "Cobranças PIX", "Ocupação acima da referência"].map((title, i) => <div className="report-card panel" key={title}><div className="report-icon"><FileBarChart size={20} /></div><h2>{title}</h2><p>{["Custos, margem e recebimentos anuais", "Histórico de serviços e pagamentos", "Pendentes, vencidas e pagas", "Serviços que excederam as vagas"][i]}</p><button className="link-btn">Abrir relatório →</button></div>)}</div></>; }

function SettingsPage({ darkMode, onToggleTheme }: { darkMode: boolean; onToggleTheme: () => void }) { return <><div className="page-heading"><div><p className="eyebrow">SISTEMA</p><h1>Configurações</h1><p className="muted">Preferências do seu espaço de gestão.</p></div></div><div className="panel settings-list">{["Dados do administrador", "Gateway de pagamentos PIX", "Notificações e lembretes", "Ciclo anual padrão"].map((item, i) => <div className="setting-row" key={item}><div><strong>{item}</strong><p>{["Admin Costa · admin@assina.com", "Asaas · conectado", "30, 15, 7 e 1 dia antes do vencimento", "Anuidade · fuso de São Paulo"][i]}</p></div><button className="secondary-btn">Editar</button></div>)}<div className="setting-row"><div><strong>Tema da interface</strong><p>{darkMode ? "Tema escuro ativado" : "Tema claro ativado"}</p></div><button className="secondary-btn" onClick={onToggleTheme}>{darkMode ? <Sun size={15} /> : <Moon size={15} />} {darkMode ? "Usar claro" : "Usar escuro"}</button></div></div></>; }

function AddService({ onClose }: { onClose: () => void }) { return <div className="modal-backdrop"><div className="modal"><div className="modal-header"><div><p className="eyebrow">NOVO CADASTRO</p><h2>Adicionar serviço</h2></div><button className="close-btn" onClick={onClose}><X /></button></div><div className="form-grid"><label>Nome do serviço<input placeholder="Ex.: Amazon Prime" /></label><label>Plano contratado<input placeholder="Ex.: Família" /></label><label>Valor total da anuidade<input placeholder="R$ 0,00" /></label><label>Referência de vagas<input placeholder="Ex.: 4" type="number" /></label><label>Data de contratação<input type="date" /></label><label>Data de renovação<input type="date" /></label><label className="full">Observações<textarea placeholder="Regras de uso, telas e demais informações..." /></label></div><div className="modal-footer"><button className="secondary-btn" onClick={onClose}>Cancelar</button><button className="primary-btn" onClick={onClose}>Salvar serviço</button></div></div></div>; }

export default App;
