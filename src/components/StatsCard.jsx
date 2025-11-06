// src/components/StatsCard.jsx
import { CheckCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";

/**
 * Props:
 * - title: string
 * - value: number|string
 * - variant: "cta" | "accent"   -> color del número e icono (cta=azul, accent=verde)
 * - icon: "userplus" | "check"
 */
export default function StatsCard({ title, value, variant = "cta", icon = "userplus" }) {
  const Icon = icon === "userplus" ? UserPlusIcon : CheckCircleIcon;

  const colorText = variant === "accent" ? "text-accent" : "text-cta";
  const borderColor = variant === "accent" ? "border-accent/30" : "border-cta/30";
  const iconColor = variant === "accent" ? "text-accent" : "text-cta";

  return (
    <div className="card p-6 relative">
      {/* Icono arriba-derecha dentro de círculo */}
      <div className={`absolute right-4 top-4 rounded-full border ${borderColor} p-1`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      <p className="text-slate-500">{title}</p>
      <p className={`mt-3 text-5xl font-semibold ${colorText}`}>{value}</p>
    </div>
  );
}
