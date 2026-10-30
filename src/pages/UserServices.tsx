import { Check, Clock, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { services } from "../data";
import { brl, formatDate } from "../utils";
import { createRequest, listMyRequests, type ServiceRequest } from "../api/requests";
import { ApiError } from "../api/client";

export default function UserServices() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    listMyRequests()
      .then(setRequests)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erro ao carregar."))
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = async (serviceId: number, serviceName: string) => {
    setSubmitting(serviceId);
    setError(null);
    try {
      const entry = await createRequest(serviceId, serviceName);
      setRequests((prev) => [entry, ...prev]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erro ao solicitar.");
    } finally {
      setSubmitting(null);
    }
  };

  const getStatus = (serviceId: number) =>
    requests.find((r) => r.service_id === serviceId);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CATÁLOGO</p>
          <h1>Serviços disponíveis</h1>
          <p className="muted">Explore os serviços e solicite participação.</p>
        </div>
      </div>

      {error && <div className="login-error" role="alert" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <p className="muted">Carregando...</p>}

      <div className="services-grid">
        {services.map((s) => {
          const req = getStatus(s.id);
          return (
            <div className="panel service-card" key={s.id}>
              <div className="service-card-header">
                <div className="service-logo" style={{ background: s.color }}>
                  {s.name[0]}
                </div>
                <div>
                  <strong>{s.name}</strong>
                  <small>{s.plan}</small>
                </div>
              </div>
              <div className="service-card-body">
                <div className="service-detail">
                  <span>Valor anual por pessoa</span>
                  <strong>{brl(s.chargeValue)}</strong>
                </div>
                <div className="service-detail">
                  <span>Vagas</span>
                  <strong>{s.participants}/{s.seats}</strong>
                </div>
                <div className="service-detail">
                  <span>Renovação</span>
                  <strong>{formatDate(s.renewsAt)}</strong>
                </div>
                <p className="service-notes">{s.notes}</p>
              </div>
              <div className="service-card-footer">
                {req ? (
                  <span className={`request-status ${req.status}`}>
                    {req.status === "solicitado" && <><Clock size={14} /> Aguardando aprovação</>}
                    {req.status === "aprovado" && <><Check size={14} /> Aprovado</>}
                    {req.status === "recusado" && <><X size={14} /> Recusado</>}
                  </span>
                ) : (
                  <button
                    className="primary-btn"
                    onClick={() => handleRequest(s.id, s.name)}
                    disabled={submitting === s.id}
                  >
                    <Send size={14} /> {submitting === s.id ? "Enviando..." : "Solicitar participação"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
