export interface ServiceRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  serviceId: number;
  serviceName: string;
  date: string;
  status: "solicitado" | "aprovado" | "recusado";
}

const STORAGE_KEY = "assina-service-requests";

function load(): ServiceRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ServiceRequest[];
  } catch { /* corrupted */ }
  return [];
}

function save(list: ServiceRequest[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ok */ }
}

export function getRequests(): ServiceRequest[] {
  return load();
}

export function addRequest(req: Omit<ServiceRequest, "id" | "date" | "status">): ServiceRequest {
  const list = load();
  const id = list.length > 0 ? Math.max(...list.map((r) => r.id)) + 1 : 1;
  const entry: ServiceRequest = {
    ...req,
    id,
    date: new Date().toISOString().slice(0, 10),
    status: "solicitado",
  };
  list.push(entry);
  save(list);
  return entry;
}

export function updateRequestStatus(id: number, status: "aprovado" | "recusado") {
  const list = load();
  const item = list.find((r) => r.id === id);
  if (item) {
    item.status = status;
    save(list);
  }
}

export function getUserRequests(userId: number): ServiceRequest[] {
  return load().filter((r) => r.userId === userId);
}
