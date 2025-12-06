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
  esfinal = false,
}) {
  const noData = rows.length === 0;

  return (
    <div className="bg-white border border-ink/10 rounded-2xl shadow-sm">
      {/* Título */}
      <div className="px-6 pt-5">
        <h2 className="text-2xl font-semibold">{titulo}</h2>
      </div>

      {/* Filtros alineados con columnas [Nombre|Área|Nivel|Puntaje|Estado] */}
      <div className="px-6 mt-2">
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-4" />
          <div className="col-span-2">
            <CustomSelect
              options={areas}
              value={area}
              onChange={setArea}
              className="w-full"
            />
          </div>
          <div className="col-span-3">
            <CustomSelect
              options={niveles}
              value={nivel}
              onChange={setNivel}
              className="w-full"
            />
          </div>
          <div className="col-span-1" />
          <div className="col-span-2" />
        </div>
      </div>

      {/* Tabla */}
      <div className="px-6 pb-6 pt-2">
        <div className="border rounded-xl overflow-x-auto">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <table className="min-w-full text-sm table-fixed">
                <thead className="bg-surface text-ink/70">
                  <tr>
                    {esfinal && (
                      <th className="p-3 text-center w-1/12">Puesto</th>
                    )}
                    <th className="p-3 text-left w-3/12">Nombre</th>
                    <th className="p-3 text-left w-2/12">Área</th>
                    <th className="p-3 text-left w-2/12">Nivel</th>
                    <th className="p-3 text-left w-2/12">Puntaje</th>
                    {!esfinal && (
                      <th className="p-3 text-left w-3/12">Estado</th>
                    )}
                    {esfinal && (
                      <th className="p-3 text-left w-3/12">Premio</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      {esfinal && (
                        <td className="p-3 text-center">{r.puesto}</td>
                      )}
                      <td className="p-3 truncate">{r.nombre}</td>
                      <td className="p-3 truncate">{r.area}</td>
                      <td className="p-3 truncate">{r.nivel}</td>
                      <td className="p-3">
                        {" "}
                        {r.puntaje ? r.puntaje + " pts" : ""}
                      </td>
                      {!esfinal && <td className="p-3">{r.estado}</td>}
                      {esfinal && <td className="p-3">{r.premio}</td>}
                    </tr>
                  ))}
                  {noData && (
                    <tr>
                      <td className="p-4 text-ink/60" colSpan={5}>
                        Sin datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
        {rows.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="px-4 py-2 border rounded"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>

            <span className="px-4 py-2 ">
              Página {page} de {totalPages}
            </span>

            <button
              className="px-4 py-2 border rounded"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Aviso debajo de la tabla en rojo */}
        {noData && (
          <p
            className="mt-3 text-sm font-semibold"
            style={{ color: "#DC2626" }}
          >
            No hay clasificados para los filtros actuales.
          </p>
        )}
      </div>
    </div>
  );
}
