import type { LucideIcon } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "yellow" | "red";
  icon: LucideIcon;
}

export function Metric({ label, value, detail, tone, icon: Icon }: MetricProps) {
  return (
    <div className="metric-card" role="group" aria-label={label}>
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} aria-hidden="true" />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small className={tone === "red" ? "negative" : "positive"}>
        {tone !== "red" && "↗ "}
        {detail}
      </small>
    </div>
  );
}
