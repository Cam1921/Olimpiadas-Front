// src/pages/dashboard/notificaciones/components/StatusBadge.jsx
const map = {
  Confirmado: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Pendiente:  { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  Rebotado:   { bg: "bg-red-100",   text: "text-red-700",   dot: "bg-red-500"   },
};

export default function StatusBadge({ value }) {
  const m = map[value] ?? { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
  
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap ${m.bg} ${m.text}`}>
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {value}
    </span>
  );
}