import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/services": "Serviços",
  "/participants": "Participantes",
  "/requests": "Solicitações",
  "/charges": "Cobranças anuais",
  "/pix": "Pagamentos PIX",
  "/reports": "Relatórios",
  "/settings": "Configurações",
};

interface TopbarProps {
  onMenuOpen: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Topbar({ onMenuOpen, darkMode, onToggleTheme }: TopbarProps) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const pageTitle = titles[pathname] ?? "Dashboard";
  const initials = user?.name.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "?";

  return (
    <header className="topbar" role="banner">
      <button className="menu-toggle" onClick={onMenuOpen} aria-label="Abrir menu">
        <Menu />
      </button>
      <div className="breadcrumb" aria-label="Navegação atual">
        <span>Visão geral</span>
        <strong>/</strong>
        <b>{pageTitle}</b>
      </div>
      <div className="top-actions">
        <button
          className="icon-btn theme-toggle"
          onClick={onToggleTheme}
          title={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
          aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-btn" aria-label="Notificações">
          <Bell size={19} />
          <i />
        </button>
        <button className="icon-btn" onClick={logout} title="Sair" aria-label="Sair da conta">
          <LogOut size={18} />
        </button>
        <div className="top-avatar" title={user?.name} aria-label="Perfil">
          {initials}
        </div>
      </div>
    </header>
  );
}
