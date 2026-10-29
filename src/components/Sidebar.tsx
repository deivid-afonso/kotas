import {
  Bell,
  ChevronDown,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Serviços", icon: CreditCard },
  { to: "/participants", label: "Participantes", icon: Users },
  { to: "/requests", label: "Solicitações", icon: Bell, badge: 3 },
  { to: "/charges", label: "Cobranças anuais", icon: WalletCards },
  { to: "/pix", label: "Pagamentos PIX", icon: Zap },
  { to: "/reports", label: "Relatórios", icon: FileBarChart },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`} role="navigation" aria-label="Menu principal">
        <div className="brand">
          <div className="brand-mark">
            <Zap size={18} fill="currentColor" />
          </div>
          <span>
            assina<span className="brand-dot">.</span>
          </span>
        </div>
        <div className="workspace">
          <div className="avatar">AC</div>
          <div>
            <strong>Admin Costa</strong>
            <small>Administrador</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <b>{item.badge}</b>}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => { navigate("/settings"); onClose(); }}>
            <Settings size={18} /> Configurações
          </button>
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Precisa de ajuda?</strong>
            <span>Veja como funciona</span>
          </div>
        </div>
      </aside>
      {open && <button className="backdrop" onClick={onClose} aria-label="Fechar menu" />}
    </>
  );
}
