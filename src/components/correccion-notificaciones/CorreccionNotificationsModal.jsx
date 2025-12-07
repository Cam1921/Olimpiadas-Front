import React from "react";
import { useCorreccionNotificaciones } from "../../hooks/useCorreccionNotificaciones";

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

  const lista = notificaciones?.todas ?? [];

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

        {/* Contenido */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
          {lista.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              No tienes correcciones pendientes.
            </p>
          )}

          {lista.map((item) => {
            const data = item.data;

            return (
              <article
                key={item.id}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition
                  ${
                    item.read_at
                      ? "bg-white border-gray-200 hover:border-gray-300"
                      : "bg-blue-50 border-blue-200 hover:border-blue-300"
                  }`}
                onClick={() => handleClickNotificacion(item)}
              >
                {/* Punto + avatar */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  {!item.read_at && (
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  )}
                  <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-semibold">
                    {data.responsable
                      ?.split(" ")
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase() || "RS"}
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {data.responsable} devolvió una nota
                    </p>

                    {/* FECHA + RELATIVO */}
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">
                        {item.tiempoRelativo}
                      </span>

                      <span className="text-[10px] text-gray-400 whitespace-nowrap block">
                        {new Date(item.created_at).toLocaleString("es-BO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-800 mt-1">
                    <span className="font-semibold">Competidor:</span>{" "}
                    {data.nombre_competidor}
                  </p>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 text-[11px] bg-white">
                      {data.area}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 text-[11px] bg-white">
                      {data.nivel}
                    </span>
                  </div>

                  {data.motivo && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {data.motivo}
                    </p>
                  )}
                </div>

                <div className="flex items-center text-gray-400 text-lg">›</div>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 text-[11px] text-gray-500 text-center">
          Haz clic en una notificación para revisar y corregir la nota.
        </div>
      </div>
    </div>
  );
}
