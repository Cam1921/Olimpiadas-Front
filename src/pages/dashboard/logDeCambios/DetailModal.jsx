// src/pages/dashboard/trazabilidad/log/DetailModal.jsx
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FiX } from "react-icons/fi";

function tipoAccionClasses(tipo) {
  if (tipo === "Inserción") return "bg-blue-100 text-blue-800 border-blue-200";
  if (tipo === "Actualización") return "bg-green-100 text-green-800 border-green-200";
  if (tipo === "Eliminación") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function DetailModal({ open, onClose, log }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Detalle completo del registro {log ? `#${log.id}` : ""}</h3>
            <p className="text-sm text-gray-500">Información completa del cambio</p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {log ? (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Fecha y hora</p>
                <div className="text-sm">{format(new Date(log.fecha + "T00:00:00"), "dd/MM/yyyy", { locale: es })} — {log.hora}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tipo de cambio</p>
                <div><span className={`px-2 py-0.5 text-xs rounded border ${tipoAccionClasses(log.tipoAccion)}`}>{log.tipoAccion}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <div className="text-sm">{log.competidor}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Área</p>
                  <div className="text-sm">{log.area}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nivel</p>
                  <div className="text-sm">{log.nivel}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fase</p>
                  <div className="text-sm">{log.fase}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={log.notaAntes ? "bg-red-50 border border-red-200 p-3 rounded" : "bg-gray-50 p-3 rounded border"}>
                <p className="text-xs text-gray-500">Nota anterior</p>
                <div className="text-2xl font-mono">{log.notaAntes ? log.notaAntes : <span className="text-gray-400">Sin nota previa</span>}</div>
              </div>

              <div className={log.notaDespues ? "bg-green-50 border border-green-200 p-3 rounded" : "bg-gray-50 p-3 rounded border"}>
                <p className="text-xs text-gray-500">Nota nueva</p>
                <div className="text-2xl font-mono">{log.notaDespues ? log.notaDespues : <span className="text-gray-400">Nota eliminada</span>}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Usuario</p>
                  <div className="text-sm">{log.usuario}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rol</p>
                  <div className="text-sm">{log.rol}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-xs text-gray-500">Motivo del cambio</p>
              <div className="text-sm">{log.motivo}</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded">
              <p className="text-xs text-amber-900"><strong>Importante:</strong> Este registro es permanente y no puede ser editado ni eliminado. Forma parte del sistema de trazabilidad para auditorías y reclamos oficiales.</p>
            </div>

            <div className="flex justify-end">
              <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Cerrar</button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No hay registro seleccionado</div>
        )}
      </div>
    </div>
  );
}
