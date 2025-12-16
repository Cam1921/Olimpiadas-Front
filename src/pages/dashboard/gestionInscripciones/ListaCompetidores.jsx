import { FiDownload } from "react-icons/fi";
import Dropdown from "@/components/Dropdown";
import { FaChevronDown } from "react-icons/fa";

export default function ListaCompetidores({
  data = [],
  lastPage,
  setters,
  opciones,
  filtros,
  onExportExcel,
  loading,
}) {
  const noData = data.length === 0;
  return (
    <main className="mx-auto">
      <div className="bg-white py-6">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
          {/* Filtros */}
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <Dropdown
              icon={FaChevronDown}
              items={opciones.areasDisponibles || []}
              defaultLabel="Todas las areas"
              dropdowClass="sm:w-full"
              buttonClass="w-full"
              menuClass="w-full md:w-48 left-0"
              onSelect={(nombreSeleccionado) => {
                setters.setArea(nombreSeleccionado);
                setters.setNivel("Todos los niveles");
                setters.setImportedData([]);
                setters.setPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <Dropdown
              icon={FaChevronDown}
              items={opciones.nivelesDisponibles || []}
              selectedLabel={filtros.nivel || "Todos los niveles"}
              defaultLabel="Todos los niveles"
              menuClass="w-full md:w-48  left-0"
              onSelect={(nombreSeleccionado) => {
                setters.setNivel(nombreSeleccionado);
                setters.setImportedData([]);
                setters.setPage(1);
              }}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda
            </label>
            <input
              type="text"
              placeholder="Por nombre / CI / Unidad educativa"
              value={filtros.query}
              onChange={(e) => {
                setters.setQuery(e.target.value);
                setters.setImportedData([]);
                setters.setPage(1);
              }}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <button
            onClick={onExportExcel}
            className="flex items-center border hover:text-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] bg-[var(--primary)] transition"
          >
            <FiDownload size={16} />
            Exportar Excel
          </button>
        </div>

        <div className="border-base-content/25 w-full rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">CI</th>
                  <th className="px-4 py-2 text-left">Unidad educativa</th>
                  <th className="px-4 py-2 text-left">Departamento</th>
                  <th className="px-4 py-2 text-left">Área</th>
                  <th className="px-4 py-2 text-left">Nivel</th>
                  <th className="px-4 py-2 text-left">Contacto Tutor Legal</th>
                  <th className="px-4 py-2 text-left">
                    Contacto Tutor Académico
                  </th>
                  <th className="px-4 py-2 text-left">Equipo</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      Cargando...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No se encontraron competidores.
                    </td>
                  </tr>
                ) : (
                  data.map((c, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 flex items-center gap-3">
                        <span className="font-medium text-gray-800">
                          {c.nombres}
                        </span>
                      </td>
                      <td className="px-4 py-2">{c.ci}</td>
                      <td className="px-4 py-2">{c.unidad_educativa}</td>
                      <td className="px-4 py-2">{c.departamento}</td>
                      <td className="px-4 py-2">{c.area}</td>
                      <td className="px-4 py-2">{c.nivel}</td>
                      <td className="px-4 py-2">{c.contacto_tutor_legal}</td>
                      <td className="px-4 py-2">
                        {c.contacto_tutor_academico || "-"}
                      </td>
                      <td className="px-4 py-2">{c.nombre_equipo || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-ink/60">
          <div>
            {noData
              ? "Sin resultados para mostrar."
              : `Mostrando página ${filtros.page} de ${lastPage}.`}
          </div>
          {!noData && (
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setters.setPage((p) => Math.max(1, p - 1))}
                disabled={filtros.page <= 1}
                className="px-3 py-1 rounded-full border text-xs disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() =>
                  setters.setPage((p) => (p < lastPage ? p + 1 : p))
                }
                disabled={filtros.page >= lastPage}
                className="px-3 py-1 rounded-full border text-xs disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
