import { useState, type FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, UserPlus, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Register({ onGoLogin }: { onGoLogin: () => void }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const err = await register(name, email, password);
    if (err) { setError(err); setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark">
            <Zap size={20} fill="currentColor" />
          </div>
          <h1>assina<span className="brand-dot">.</span></h1>
          <p>Crie sua conta para participar das assinaturas</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <label className="login-field">
            <span>Nome completo</span>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              autoComplete="name"
              autoFocus
              required
            />
          </label>

          <label className="login-field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Senha</span>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                autoComplete="new-password"
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

          <label className="login-field">
            <span>Confirmar senha</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <div className="spinner small" /> : <><UserPlus size={16} /> Criar conta</>}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <button type="button" className="login-register-btn" onClick={onGoLogin}>
          Já tenho uma conta
        </button>
      </div>

      <p className="login-footer">© 2025 Assina · Gestão de assinaturas compartilhadas</p>
    </div>
  );
}
