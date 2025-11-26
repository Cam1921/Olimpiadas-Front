import React from "react";
import { useCorreccionNotificaciones } from "../../hooks/useCorreccionNotificaciones";

export default function CorreccionNotificationsModal() {
  const {
    notificaciones,
    modalOpen,
    selected,
    abrirModal,
    cerrarModal,
    enviarCorreccion,
  } = useCorreccionNotificaciones();

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          Corrección de Notificaciones
        </h2>

        {/* Lista */}
        {!selected && (
          <div className="space-y-3">
            {notificaciones.length === 0 && (
              <p className="text-gray-500 text-sm">No hay notificaciones pendientes.</p>
            )}

            {notificaciones.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => abrirModal(item)}
              >
                <p className="font-medium">{item.competidor}</p>
                <p className="text-xs text-gray-500">
                  Responsable: {item.responsable}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Detalle */}
        {selected && (
          <>
            <p className="font-medium">{selected.competidor}</p>
            <p className="text-gray-600 text-sm mb-4">
              Observación: {selected.observacion}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => enviarCorreccion(selected.id, "aceptado")}
              >
                Aceptar
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => enviarCorreccion(selected.id, "rechazado")}
              >
                Rechazar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
