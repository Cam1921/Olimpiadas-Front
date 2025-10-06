import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import * as XLSX from "xlsx";

export default function GestionInscripciones({ importedData = [] }) {
  const [gestion, setGestion] = useState(2025);
  const [areaId, setAreaId] = useState("");
  const [nivelId, setNivelId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [data, setData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [niveles, setNiveles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Cargar áreas y niveles
  const fetchCatalogos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/catalogos");
      const areasApi = res.data.areas.map((a) => ({
        id: a.id,
        nombre: a.nombre_area,
      }));
      const nivelesApi = res.data.niveles.map((n) => ({
        id: n.id,
        nombre: n.nombre_nivel,
      }));

      setAreas([{ id: "", nombre: "Todos" }, ...areasApi]);
      setNiveles([{ id: "", nombre: "Todos" }, ...nivelesApi]);
    } catch (error) {
      console.error("Error al obtener áreas y niveles", error);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  // 🔹 Fetch desde backend
  const fetchCompetidores = async (page = 1) => {
    setLoading(true);
    try {
      const params = { gestion, page, per_page: perPage };
      if (areaId) params.area_id = areaId;
      if (nivelId) params.nivel_id = nivelId;

      const res = await axios.get(
        "http://localhost:8000/api/competidores/listar",
        { params }
      );

      const competidores = res.data.data || [];
      const pagination = res.data.meta?.pagination || {};
      setData(competidores);
      setDisplayedData(competidores);
      setCurrentPage(pagination.current_page || 1);
      setTotalPages(pagination.last_page || 1);
    } catch (error) {
      console.error("Error al obtener competidores", error);
      setData([]);
      setDisplayedData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Si se importan datos, activar modo local
  useEffect(() => {
    if (importedData.length > 0) {
      setData(importedData);
      setCurrentPage(1);
      setTotalPages(Math.ceil(importedData.length / perPage));
    } else {
      fetchCompetidores(1);
    }
  }, [importedData]);

  // 🔹 Filtro y paginación local cuando hay datos importados
  useEffect(() => {
    if (importedData.length > 0) {
      /*  let filtered = importedData.filter((c) => {
        const matchArea = !areaId || c.area_id == areaId || c.area === areaId;
        const matchNivel =
          nivelId || c.nivel_id == nivelId || c.nivel === nivelId;
        const texto = busqueda.toLowerCase();

        const matchBusqueda =
          c.nombre?.toLowerCase().includes(texto) ||
          c.ci?.toLowerCase().includes(texto) ||
          c.unidad_educativa?.toLowerCase().includes(texto) ||
          c.departamento?.toLowerCase().includes(texto) ||
          c.area?.toLowerCase().includes(texto) ||
          c.nivel?.toLowerCase().includes(texto);

        return matchArea && matchNivel && matchBusqueda;
      }); */

      const total = Math.ceil(importedData.length / perPage);
      setTotalPages(total);

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      setDisplayedData(importedData.slice(startIndex, endIndex));
    }
  }, [importedData, currentPage, perPage]);

  // 🔹 Filtro remoto (cuando no hay importación)
  useEffect(() => {
    fetchCompetidores(currentPage);
  }, [areaId, nivelId, gestion, currentPage, perPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 🔹 Exportar a Excel
  const exportExcel = () => {
    const worksheetData = data.map((item) => ({
      Nombre: item.nombre,
      CI: item.ci,
      "Unidad Educativa": item.unidad_educativa,
      Departamento: item.departamento,
      Área: item.area,
      Nivel: item.nivel,
      "Contacto tutor legal": item.contacto_tutor_legal,
      "Contacto tutor academico": item.contacto_tutor_academico,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competidores");
    XLSX.writeFile(workbook, `competidores_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <main className="mx-auto">
      <p className="text-gray-600 py-5">Generar listas por área y nivel</p>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          {/* Filtros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={areaId}
              onChange={(e) => {
                setAreaId(e.target.value);
                setCurrentPage(1);
              }}
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={nivelId}
              onChange={(e) => {
                setNivelId(e.target.value);
                setCurrentPage(1);
              }}
            >
              {niveles.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda
            </label>
            <input
              type="text"
              placeholder="Por nombre / CI / Unidad educativa"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <button
            onClick={() => fetchCompetidores(1)}
            className="flex items-center gap-2 border px-5 py-2 rounded-lg text-sm hover:text-white hover:bg-[var(--primary)] transition"
          >
            Generar listas
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center border hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] transition"
          >
            <FiDownload size={16} />
            Exportar Excel
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : displayedData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No se encontraron competidores
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-700">
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
                </tr>
              </thead>
              <tbody>
                {displayedData
                  .filter(
                    (c) =>
                      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      c.ci.includes(busqueda) ||
                      c.unidad_educativa
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      c.area.toLowerCase().includes(busqueda.toLowerCase()) ||
                      c.nivel.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((c, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{c.nombre}</td>
                      <td className="px-4 py-2">{c.ci}</td>
                      <td className="px-4 py-2">{c.unidad_educativa}</td>
                      <td className="px-4 py-2">{c.departamento}</td>
                      <td className="px-4 py-2">{c.area}</td>
                      <td className="px-4 py-2">{c.nivel}</td>
                      <td className="px-4 py-2">{c.contacto_tutor_legal}</td>
                      <td className="px-4 py-2">
                        {c.contacto_tutor_academico}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
