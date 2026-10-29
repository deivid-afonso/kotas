import { Moon, Sun } from "lucide-react";

const items = [
  { label: "Dados do administrador", detail: "Admin Costa · admin@assina.com" },
  { label: "Gateway de pagamentos PIX", detail: "Asaas · conectado" },
  { label: "Notificações e lembretes", detail: "30, 15, 7 e 1 dia antes do vencimento" },
  { label: "Ciclo anual padrão", detail: "Anuidade · fuso de São Paulo" },
];

interface SettingsProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Settings({ darkMode, onToggleTheme }: SettingsProps) {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SISTEMA</p>
          <h1>Configurações</h1>
          <p className="muted">Preferências do seu espaço de gestão.</p>
        </div>
      </div>
      <div className="panel settings-list">
        {items.map((item) => (
          <div className="setting-row" key={item.label}>
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
            <button className="secondary-btn">Editar</button>
          </div>
        ))}
        <div className="setting-row">
          <div>
            <strong>Tema da interface</strong>
            <p>{darkMode ? "Tema escuro ativado" : "Tema claro ativado"}</p>
          </div>
          <button className="secondary-btn" onClick={onToggleTheme}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}{" "}
            {darkMode ? "Usar claro" : "Usar escuro"}
          </button>
        </div>
      </div>
    </>
  );
}
