import { api } from "./client";

export interface ServiceRequest {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  service_id: number;
  service_name: string;
  status: "solicitado" | "aprovado" | "recusado";
  created_at: string;
}

export const listMyRequests = () => api<ServiceRequest[]>("/requests/mine");

export const listAllRequests = () => api<ServiceRequest[]>("/requests");

export const createRequest = (serviceId: number, serviceName: string) =>
  api<ServiceRequest>("/requests", {
    method: "POST",
    body: JSON.stringify({ serviceId, serviceName }),
  });

export const updateRequestStatus = (id: number, status: "aprovado" | "recusado") =>
  api<{ id: number; status: string }>(`/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
