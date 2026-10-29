import { AnnualCharge, Participant, Service } from "./types";

export const services: Service[] = [
  { id: 1, name: "Netflix", plan: "Premium", annualValue: 900, chargeValue: 225, contractedAt: "2025-02-14", renewsAt: "2026-02-14", seats: 4, participants: 5, color: "#e50914", notes: "Plano família · 4 telas · Não compartilhar fora da residência" },
  { id: 2, name: "Amazon Prime", plan: "Vídeo", annualValue: 240, chargeValue: 80, contractedAt: "2025-03-02", renewsAt: "2026-03-02", seats: 3, participants: 2, color: "#00a8e1", notes: "Vídeo, frete Prime e músicas incluídos" },
  { id: 3, name: "Disney+", plan: "Premium", annualValue: 840, chargeValue: 210, contractedAt: "2025-01-28", renewsAt: "2026-01-28", seats: 4, participants: 3, color: "#113ccf", notes: "4 telas simultâneas · Conteúdo 4K" },
  { id: 4, name: "HBO Max", plan: "Platinum", annualValue: 720, chargeValue: 180, contractedAt: "2025-06-18", renewsAt: "2026-06-18", seats: 4, participants: 4, color: "#5824d6", notes: "Plano sem anúncios · Catálogo HBO e Warner" },
  { id: 5, name: "Apple TV+", plan: "Individual", annualValue: 480, chargeValue: 96, contractedAt: "2025-02-22", renewsAt: "2026-02-22", seats: 5, participants: 3, color: "#1f2937", notes: "Apple Originals · Compartilhamento familiar" },
  { id: 6, name: "Spotify", plan: "Família", annualValue: 600, chargeValue: 100, contractedAt: "2025-04-02", renewsAt: "2026-04-02", seats: 6, participants: 6, color: "#1ed760", notes: "Até 6 contas individuais" },
  { id: 7, name: "YouTube Premium", plan: "Família", annualValue: 660, chargeValue: 110, contractedAt: "2025-05-10", renewsAt: "2026-05-10", seats: 6, participants: 4, color: "#ff0000", notes: "YouTube sem anúncios e YouTube Music" },
  { id: 8, name: "Premiere", plan: "Brasileirão", annualValue: 480, chargeValue: 160, contractedAt: "2025-02-05", renewsAt: "2026-02-05", seats: 3, participants: 3, color: "#087f45", notes: "Futebol ao vivo · Verificar regras de acesso" },
  { id: 9, name: "Paramount+", plan: "Premium", annualValue: 360, chargeValue: 120, contractedAt: "2025-07-12", renewsAt: "2026-07-12", seats: 3, participants: 2, color: "#0064ff", notes: "Filmes, séries e esportes selecionados" },
  { id: 10, name: "Globoplay", plan: "Premium", annualValue: 480, chargeValue: 120, contractedAt: "2025-08-01", renewsAt: "2026-08-01", seats: 4, participants: 2, color: "#ff7a00", notes: "Conteúdo Globo e canais ao vivo" },
  { id: 11, name: "Crunchyroll", plan: "Mega Fan", annualValue: 360, chargeValue: 120, contractedAt: "2025-09-10", renewsAt: "2026-09-10", seats: 3, participants: 1, color: "#f47521", notes: "Animes e lançamentos simulcast" },
  { id: 12, name: "Duolingo", plan: "Família", annualValue: 300, chargeValue: 50, contractedAt: "2025-10-01", renewsAt: "2026-10-01", seats: 6, participants: 2, color: "#58cc02", notes: "Plano família · Até 6 perfis para aprender idiomas" },
];

export const participants: Participant[] = [];

export const charges: AnnualCharge[] = [];
