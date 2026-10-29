import {
  Bell,
  ChevronDown,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const adminNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Serviços", icon: CreditCard },
  { to: "/participants", label: "Participantes", icon: Users },
  { to: "/requests", label: "Solicitações", icon: Bell },
  { to: "/charges", label: "Cobranças anuais", icon: WalletCards },
  { to: "/pix", label: "Pagamentos PIX", icon: Zap },
  { to: "/reports", label: "Relatórios", icon: FileBarChart },
];

const userNav = [
  { to: "/", label: "Meu painel", icon: LayoutDashboard },
  { to: "/services", label: "Serviços", icon: CreditCard },
  { to: "/charges", label: "Minhas cobranças", icon: WalletCards },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const nav = isAdmin ? adminNav : userNav;
  const initials = user?.name.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "?";

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
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user?.name}</strong>
            <small>{isAdmin ? "Administrador" : "Participante"}</small>
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
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => { navigate("/settings"); onClose(); }}>
            <Settings size={18} /> Configurações
          </button>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>
      {open && <button className="backdrop" onClick={onClose} aria-label="Fechar menu" />}
    </>
  );
}
