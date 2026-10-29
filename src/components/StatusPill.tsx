export function StatusPill({ status }: { status: string }) {
  const label =
    status === "pago"
      ? "Pago"
      : status === "pendente"
        ? "Pendente"
        : status === "vencido"
          ? "Vencido"
          : status;
  return (
    <span className={`status-pill ${status}`} role="status">
      {label}
    </span>
  );
}
