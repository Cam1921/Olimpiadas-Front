// src/pages/dashboard/publicacion/components/ResultsCard.jsx
import CustomSelect from "./CustomSelect";

export default function ResultsCard({
  titulo = "Resultados Fase Clasificatoria",
  areas,
  area,
  setArea,
  niveles,
  nivel,
  setNivel,
  rows = [],
  setPage,
  page,
  totalPages,
  loading,
}) {
  const noData = rows.length === 0;

  return (
    <div className="bg-white border border-ink/10 rounded-2xl shadow-sm">
      {/* Título */}
      <div className="px-4 md:px-6 pt-5">
        <h2 className="text-xl md:text-2xl font-semibold">{titulo}</h2>
      </div>

      {/* Filtros alineados con columnas [Nombre|Área|Nivel|Puntaje|Estado] */}
      <div className="px-4 md:px-6 mt-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
          {/* Columna vacía (se muestra solo en desktop para alinear con tabla) */}
          <div className="hidden md:block md:col-span-4" />

          {/* Select Área */}
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              options={areas}
              value={area}
              onChange={setArea}
              className="w-full"
            />
          </div>

          {/* Select Nivel */}
          <div className="col-span-1 md:col-span-3">
            <CustomSelect
              options={niveles}
              value={nivel}
              onChange={setNivel}
              className="w-full"
            />
          </div>

          {/* Columna vacía para alinear (solo desktop) */}
          <div className="hidden md:block md:col-span-1" />

          {/* Texto de ayuda / estado de carga */}
          <div className="col-span-1 md:col-span-2 text-xs text-ink/60 text-left md:text-right">
            {loading
              ? "Cargando resultados…"
              : "Filtra por área y nivel para ver los resultados."}
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="px-2 md:px-6 pb-6 pt-2">
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-surface text-xs text-ink/60">
                <tr>
                  <th className="px-3 py-2 text-left">Nombre del competidor</th>
                  <th className="px-3 py-2 text-left">Área</th>
                  <th className="px-3 py-2 text-left">Nivel</th>
                  <th className="px-3 py-2 text-right">Puntaje</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {noData ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-gray-500 text-sm"
                    >
                      No hay resultados para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-2">{row.nombre}</td>
                      <td className="px-3 py-2">{row.area}</td>
                      <td className="px-3 py-2">{row.nivel}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        {row.puntaje}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                            row.estadoColor || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.estadoIcon && (
                            <span className="inline-block">
                              {row.estadoIcon}
                            </span>
                          )}
                          {row.estadoTexto}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación (se mantiene igual) */}
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-ink/60">
          <div>
            {noData
              ? "Sin resultados para mostrar."
              : `Mostrando página ${page} de ${totalPages}.`}
          </div>
          {!noData && (
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded-full border text-xs disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((p) => (p < totalPages ? p + 1 : p))
                }
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-full border text-xs disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
