export default function EmptyState({ title = "Sin datos", subtitle }) {
  return (
    <div className="border rounded-2xl p-6 text-center text-sm">
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}
