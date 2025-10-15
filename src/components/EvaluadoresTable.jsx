// src/components/EvaluadoresTable.jsx
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EvaluadoresTable({ data = [], onEdit, onDelete }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 pt-6">
        <h3 className="text-2xl font-semibold text-primary">
          Evaluadores Registrados
        </h3>
        <p className="text-slate-500">
          Lista completa de evaluadores activos en el sistema
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4">
          <thead className="text-left text-slate-500">
            <tr className="border-y border-slate-200">
              <th className="px-6 py-4">Nombre Completo</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">CI</th>
              <th className="px-6 py-4">Área</th>
              <th className="px-6 py-4">Nivel</th>
              <th className="px-6 py-4">Fecha Registro</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  {r.nombre} {r.apellidos}
                </td>
                <td className="px-6 py-4">{r.correo}</td>
                <td className="px-6 py-4">{r.telefono}</td>
                <td className="px-6 py-4">{r.ci}</td>
                <td className="px-6 py-4">{r.area}</td>
                <td className="px-6 py-4">{r.nivel}</td>
                <td className="px-6 py-4">{r.fecha}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-cta hover:opacity-80"
                      title="Editar"
                      aria-label="Editar evaluador"
                      onClick={() => onEdit?.(r, r.id)} // <-- IMPORTANTE: pasamos idx
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:opacity-80"
                      title="Eliminar"
                      aria-label="Eliminar evaluador"
                      onClick={() => onDelete?.(r, r.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-slate-500" colSpan={8}>
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
