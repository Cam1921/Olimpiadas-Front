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
  const [loading, setLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [niveles, setNiveles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch de competidores
  const fetchCompetidores = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = { gestion };
      if (areaId) params.area_id = areaId;
      if (nivelId) params.nivel_id = nivelId;
      params.page = page;
      params.per_page = perPage;

      const res = await axios.get(
        "http://localhost:8000/api/competidores/listar",
        { params }
      );

      setData(res.data.data || []);
      const pagination = res.data.meta?.pagination || {};
      setCurrentPage(pagination.current_page || 1);
      setTotalPages(pagination.last_page || 1);
    } catch (error) {
      setData([]);
      console.error("Error al obtener competidores", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (importedData.length > 0) {
      console.log("esta entrando");
      setData(importedData);
      setCurrentPage(1); // Reiniciar a la primera página
    }
  }, [importedData]);
  // Fetch de áreas y niveles
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

      // Agregar opción "Todos"
      setAreas([{ id: "", nombre: "Todos" }, ...areasApi]);
      setNiveles([{ id: "", nombre: "Todos" }, ...nivelesApi]);
    } catch (error) {
      console.error("Error al obtener áreas y niveles", error);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  useEffect(() => {
    fetchCompetidores(currentPage);
  }, [areaId, nivelId, gestion, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const exportExcel = () => {
    const worksheetData = data
      .filter(
        (c) =>
          c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.ci.includes(busqueda) ||
          c.unidad_educativa.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.area.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.nivel.toLowerCase().includes(busqueda.toLowerCase())
      )
      .map((item) => ({
        Nombre: item.nombre,
        CI: item.ci,
        "Unidad Educativa": item.unidad_educativa,
        Departamento: item.departamento,
        Área: item.area,
        Nivel: item.nivel,
        "Contacto tutor": item.contacto_tutor_legal,
      }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competidores");

    XLSX.writeFile(workbook, `competidores_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <main className="mx-auto ">
      <p className="text-gray-600 py-5">Generar listas por área y nivel</p>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
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
              onChange={(e) => setNivelId(e.target.value)}
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
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <button
            onClick={fetchCompetidores}
            className="flex items-center gap-2 border px-5 py-2 rounded-lg text-sm hover:text-white hover:bg-[var(--primary)] transition"
          >
            Generar listas
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center border  hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] transition"
          >
            <FiDownload size={16} />
            Exportar Excel
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : data.length === 0 ? (
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
                  <th className="px-4 py-2 text-left">Tutor</th>
                </tr>
              </thead>
              <tbody>
                {data
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
                    </tr>
                  ))}
              </tbody>
            </table>
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
