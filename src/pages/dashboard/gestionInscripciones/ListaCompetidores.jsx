// src/pages/dashboard/gestionInscripciones/ListaCompetidores.jsx
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Dropdown from "@/components/Dropdown";
import { FaChevronDown } from "react-icons/fa";
import api from "@/lib/api";

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
  const fetchCatalogos = async () => {
    try {
      const res = await api.get("/catalogos");
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
  const fetchCompetidores = async (page = 1) => {
    setLoading(true);
    try {
      const params = { gestion, page, per_page: perPage };
      if (areaId) params.area_id = areaId;
      if (nivelId) params.nivel_id = nivelId;
      if (busqueda) params.busqueda = busqueda;

      const res = await api.get("/competidores/listar", { params });

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
  const exportExcel = async () => {
    try {
      const params = { gestion };
      if (areaId) params.area_id = areaId;
      if (nivelId) params.nivel_id = nivelId;
      if (busqueda) params.busqueda = busqueda;

      // Hacer request al backend para obtener el archivo
      const response = await api.get("/competidores/exportar", {
        params,
        responseType: "blob",
      });

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo
      link.setAttribute(
        "download",
        `competidores_${new Date().getFullYear()}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
    }
  };

  useEffect(() => {
    if (importedData.length > 0) {
      setData(importedData);
      setCurrentPage(1);
      setTotalPages(Math.ceil(importedData.length / perPage));
    } else {
      fetchCompetidores(1);
    }
  }, [importedData]);
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCompetidores(1);
    }, 500); // espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(delay);
  }, [busqueda]);

  useEffect(() => {
    if (importedData.length > 0) {
      const total = Math.ceil(importedData.length / perPage);
      setTotalPages(total);

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      setDisplayedData(importedData.slice(startIndex, endIndex));
    }
  }, [importedData, currentPage, perPage]);

  useEffect(() => {
    fetchCompetidores(currentPage);
  }, [areaId, nivelId, gestion, currentPage, perPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="mx-auto">
      <div className="bg-white py-6">
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          {/* Filtros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <Dropdown
              icon={FaChevronDown}
              items={areas.map((a) => a.nombre)}
              defaultLabel="Todos"
              onSelect={(nombreSeleccionado) => {
                const areaSeleccionada = areas.find(
                  (a) => a.nombre === nombreSeleccionado
                );
                setAreaId(areaSeleccionada?.id || "");
                setCurrentPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <Dropdown
              icon={FaChevronDown}
              items={niveles.map((n) => n.nombre)}
              defaultLabel="Todos"
              onSelect={(nombreSeleccionado) => {
                const nivelSeleccionado = niveles.find(
                  (n) => n.nombre === nombreSeleccionado
                );
                setNivelId(nivelSeleccionado?.id || "");
                setCurrentPage(1);
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
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                console.log(displayedData);
                console.log("se esta leengo el busqueda", busqueda);
              }}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <button
            onClick={exportExcel}
            className="flex items-center border hover:text-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] bg-[var(--primary)] transition"
          >
            <FiDownload size={16} />
            Exportar Excel
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : displayedData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No se encontraron competidores
          </p>
        ) : (
          <>
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
                      <th className="px-4 py-2 text-left">
                        Contacto Tutor Legal
                      </th>
                      <th className="px-4 py-2 text-left">
                        Contacto Tutor Académico
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((c, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 flex items-center gap-3">
                          <span className="font-medium text-gray-800">
                            {c.nombre}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
          </>
        )}
      </div>
    </main>
  );
}
