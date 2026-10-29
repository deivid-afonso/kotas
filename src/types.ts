export type Status = "pago" | "pendente" | "vencido" | "cancelado";
export type RequestStatus = "solicitado" | "aprovado" | "recusado" | "ativo" | "pausado" | "removido";

export interface Service {
  id: number;
  name: string;
  plan: string;
  annualValue: number;
  chargeValue: number;
  contractedAt: string;
  renewsAt: string;
  seats: number;
  participants: number;
  color: string;
  notes: string;
}

export interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: number[];
  status: "Ativo" | "Pendente";
  total: number;
}

export interface AnnualCharge {
  id: number;
  participant: string;
  participantId: number;
  dueDate: string;
  reference: string;
  services: { name: string; value: number; adjustment: number }[];
  status: Status;
  proof: boolean;
}
