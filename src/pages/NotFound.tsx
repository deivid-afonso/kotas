import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="error-boundary" role="alert">
      <AlertCircle size={40} />
      <h2>Página não encontrada</h2>
      <p>A página que você procura não existe ou foi movida.</p>
      <button className="primary-btn" onClick={() => navigate("/")}>
        Voltar ao Dashboard
      </button>
    </div>
  );
}
