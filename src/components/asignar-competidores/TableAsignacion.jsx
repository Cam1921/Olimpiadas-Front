import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Eye, SlidersHorizontal, Trash2, TrashIcon } from "lucide-react";
import React from "react";

function TableAsignacion({
  asignaciones = [],
  onView = () => {},
  onAssign = () => {},
  onDelete = () => {},
  page = 1,
  lastPage = 1,
  onPageChange = () => {},
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full mt-4 text-sm">
        <thead className="text-left text-slate-500 text-sm">
          <tr className="border-y border-slate-200">
            <th className="px-6 py-4">Área</th>
            <th className="px-6 py-4">Nivel</th>
            <th className="px-6 py-4 text-center">Competidores</th>
            <th className="px-6 py-4 text-center">Evaluadores asignados</th>
            <th className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {asignaciones.map((r) => (
            <>
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{r.area}</td>
                <td className="px-6 py-4">{r.nivel}</td>
                <td className="px-6 py-4 text-center">
                  {" "}
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {r.competidores}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center space-x-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {r.evaluadores_asignados}
                    </span>
                    <button
                      className="text-cta hover:opacity-80"
                      title="View"
                      aria-label="ver evaluador"
                      onClick={() => onView?.(r, r.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {" "}
                    <button
                      className="text-cta hover:opacity-80"
                      title="Editar"
                      aria-label="Editar evaluador"
                      onClick={() => onAssign?.(r, r.id)}
                    >
                      <SlidersHorizontal className="w-4 h-4" />{" "}
                    </button>
                    <button
                      className="text-red-500 hover:opacity-80"
                      title="Eliminar"
                      aria-label="Eliminar evaluador"
                      onClick={() => onDelete?.(r, r.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </>
          ))}
          {asignaciones.length === 0 && (
            <tr>
              <td className="px-6 py-6 text-slate-500 text-sm" colSpan={8}>
                No hay registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {page} de {lastPage}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === lastPage}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default TableAsignacion;
