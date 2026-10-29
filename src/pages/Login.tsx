import { useState, type FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, LogIn, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onGoRegister }: { onGoRegister: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const err = login(email, password);
      if (err) { setError(err); setLoading(false); }
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark">
            <Zap size={20} fill="currentColor" />
          </div>
          <h1>assina<span className="brand-dot">.</span></h1>
          <p>Faça login para gerenciar suas assinaturas</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <label className="login-field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              autoComplete="email"
              autoFocus
              required
            />
          </label>

          <label className="login-field">
            <span>Senha</span>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <div className="spinner small" /> : <><LogIn size={16} /> Entrar</>}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <button type="button" className="login-register-btn" onClick={onGoRegister}>
          Criar uma conta
        </button>

      </div>

      <p className="login-footer">© 2025 Assina · Gestão de assinaturas compartilhadas</p>
    </div>
  );
}
