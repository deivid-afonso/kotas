import { X } from "lucide-react";

export function AddServiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Adicionar serviço">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">NOVO CADASTRO</p>
            <h2>Adicionar serviço</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">
            <X />
          </button>
        </div>
        <div className="form-grid">
          <label>
            Nome do serviço
            <input placeholder="Ex.: Amazon Prime" autoFocus />
          </label>
          <label>
            Plano contratado
            <input placeholder="Ex.: Família" />
          </label>
          <label>
            Valor total da anuidade
            <input placeholder="R$ 0,00" inputMode="decimal" />
          </label>
          <label>
            Referência de vagas
            <input placeholder="Ex.: 4" type="number" min={1} />
          </label>
          <label>
            Data de contratação
            <input type="date" />
          </label>
          <label>
            Data de renovação
            <input type="date" />
          </label>
          <label className="full">
            Observações
            <textarea placeholder="Regras de uso, telas e demais informações..." />
          </label>
        </div>
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-btn" onClick={onClose}>
            Salvar serviço
          </button>
        </div>
      </div>
    </div>
  );
}
