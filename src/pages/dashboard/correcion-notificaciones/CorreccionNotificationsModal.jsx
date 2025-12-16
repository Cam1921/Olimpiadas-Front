import { FiBell } from "react-icons/fi";

export default function CorreccionNotificationsDropdown({
  open,
  cerrar,
  notificaciones = [],
  selected,
  abrirModal,
  enviarCorreccion,
}) {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 text-sm text-gray-700 bg-white shadow-lg border border-gray-200 rounded-xl z-50">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-gray-700">Notificaciones</h2>
      </div>

      {/* Lista */}
      <div className="max-h-64 overflow-auto">
        {notificaciones.length === 0 ? (
          <p className="text-gray-500 text-sm p-4">
            No hay notificaciones pendientes.
          </p>
        ) : (
          (notificaciones?.no_leidas ?? []).map((n) => (
            <div
              key={n.id}
              onClick={() => abrirModal(n)}
              className="px-4 py-3 border-b cursor-pointer transition hover:bg-gray-100/70"
            >
              <div className="flex items-start gap-3">
                {/* Icono */}
                <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FiBell className="h-4 w-4" />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  {/* Responsable */}
                  <p className="text-xs text-gray-500 leading-tight">
                    <span className="font-medium text-gray-700">
                      {n.data.responsable}
                    </span>{" "}
                    solicitó corrección de nota
                  </p>

                  {/* Competidor */}
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {n.data.nombre_competidor}
                  </p>

                  {/* Área / Nivel */}
                  <p className="text-xs text-gray-600">
                    {n.data.area} — Nivel {n.data.nivel}
                  </p>

                  {/* Motivo */}
                  <p className="text-xs text-gray-700 mt-2 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                    <span className="font-medium">Motivo:</span> {n.data.motivo}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="p-3 flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={cerrar}>
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
      )}
    </div>
  );
}
