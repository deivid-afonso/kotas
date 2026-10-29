import { Check, Clock, Send, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { services } from "../data";
import { brl, formatDate } from "../utils";
import { addRequest, getUserRequests, type ServiceRequest } from "../stores/serviceRequests";

export default function UserServices() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>(() =>
    user ? getUserRequests(user.id) : [],
  );

  const handleRequest = (serviceId: number, serviceName: string) => {
    if (!user) return;
    const entry = addRequest({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      serviceId,
      serviceName,
    });
    setRequests((prev) => [...prev, entry]);
  };

  const getStatus = (serviceId: number) =>
    requests.find((r) => r.serviceId === serviceId);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CATÁLOGO</p>
          <h1>Serviços disponíveis</h1>
          <p className="muted">Explore os serviços e solicite participação.</p>
        </div>
      </div>

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
                  >
                    <Send size={14} /> Solicitar participação
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
