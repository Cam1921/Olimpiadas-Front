export default function ResultsTable({ rows, loading }) {
  if (loading) return <div className="animate-pulse">Cargando…</div>;
  if (!rows?.length) return <div className="text-sm text-gray-500">Sin datos.</div>;

  return (
    <div className="border rounded-2xl overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Área</th>
            <th className="p-2 text-left">Nivel</th>
            <th className="p-2 text-left">Puntaje</th>
            <th className="p-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.codigo}</td>
              <td className="p-2">{r.nombre}</td>
              <td className="p-2">{r.area}</td>
              <td className="p-2">{r.nivel}</td>
              <td className="p-2">{r.puntaje}</td>
              <td className="p-2">{r.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
