import React from "react";
import { useCorreccionNotificaciones } from "../../hooks/useCorreccionNotificaciones";
// Si usas alias: import { useCorreccionNotificaciones } from "@/hooks/useCorreccionNotificaciones";

export default function CorreccionNotificationsModal() {
  const {
    notificaciones,
    isOpen,
    unreadCount,
    closeModal,
    handleClickNotificacion,
  } = useCorreccionNotificaciones();

  // Si el modal está cerrado, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl max-h-[80vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Notificaciones de Corrección de Notas
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {unreadCount > 0
                ? `Tienes ${unreadCount} notificaciones nuevas`
                : "No tienes nuevas notificaciones."}
            </p>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {/* Contenido: lista de notificaciones */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
          {notificaciones.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              No tienes correcciones pendientes.
            </p>
          )}

          {notificaciones.map((item) => (
            <article
              key={item.id}
              className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition
                ${
                  item.leida
                    ? "bg-white border-gray-200 hover:border-gray-300"
                    : "bg-blue-50 border-blue-200 hover:border-blue-300"
                }`}
              onClick={() => handleClickNotificacion(item)}
            >
              {/* Punto + avatar */}
              <div className="flex flex-col items-center gap-2 pt-1">
                {!item.leida && (
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                )}
                <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-semibold">
                  {item.responsableIniciales || "RS"}
                </div>
              </div>

              {/* Contenido principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.responsableNombre} devolvió una nota
                  </p>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">
                    {item.tiempoRelativo}
                  </span>
                </div>

                <p className="text-xs text-gray-800 mt-1">
                  <span className="font-semibold">Competidor:</span>{" "}
                  {item.competidorNombre}
                </p>

                {/* Chips de área y nivel */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 text-[11px] bg-white">
                    {item.areaNombre}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 text-[11px] bg-white">
                    {item.nivelNombre}
                  </span>
                </div>

                {item.motivo && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {item.motivo}
                  </p>
                )}
              </div>

              {/* Flecha */}
              <div className="flex items-center text-gray-400 text-lg">
                ›
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 text-[11px] text-gray-500 text-center">
          Haz clic en una notificación para revisar y corregir la nota.
        </div>
      </div>
    </div>
  );
}
