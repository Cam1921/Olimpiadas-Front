// src/components/OfficialListPage.jsx
import React, { useEffect, useState } from "react";
import SuccessDialog from "./SuccessDialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";
import EvaluacionesRepository from "../infrastructure/http/Evaluacion/repository";

const exportToPDF = (competitors, filterArea, filterLevel) => {
  const doc = new jsPDF();
  const filename = `Lista_Habilitados_${filterArea || "Todas"}_${
    filterLevel || "Todos"
  }.pdf`;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Lista Oficial de Habilitados - Fase Final", 14, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Área: ${filterArea === "all" ? "Todas" : filterArea}`, 14, 30);
  doc.text(`Nivel: ${filterLevel === "all" ? "Todos" : filterLevel}`, 14, 35);

  autoTable(doc, {
    startY: 45,
    head: [
      [
        "ID",
        "Nombre",
        "Área",
        "Nivel",
        "Grado",
        "Nota Clasificatoria",
        "Estado",
      ],
    ],
    body: competitors.map((c) => [
      c.id_inscrito,
      c.nombre,
      c.area,
      c.nivel,
      c["grado "],
      c.nota,
      c.estado_clasificado,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [2, 132, 199],
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: "center",
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [245, 247, 249] },
  });

  doc.save(filename);
  return filename;
};

const OfficialListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [allAreas, setAllAreas] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Cargar áreas con niveles
  async function fetchAreas() {
    try {
      const areas = await getAreasConNiveles();
      setAllAreas(areas);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  }

  // Cargar competidores desde API filtrados
  async function fetchCompetitors(page = 1) {
    setLoading(true);
    try {
      const params = {
        busqueda: searchTerm,
        estado_clasificado: "clasificados",
        id_area:
          filterArea === "all"
            ? null
            : allAreas.find((a) => a.nombre === filterArea)?.id,
        id_nivel:
          filterLevel === "all"
            ? null
            : allAreas
                .find((a) => a.nombre === filterArea)
                ?.niveles.find((n) => n.nombre_nivel === filterLevel)?.id,
        per_page: 10,
        page,
      };
      const res = await EvaluacionesRepository.filtrarEvaluaciones(params);
      setCompetitors(res.data);
      setPagination(res.meta);
    } catch (err) {
      console.error("Error al cargar competidores:", err);
      setCompetitors([]);
      setPagination({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (allAreas.length) fetchCompetitors(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterArea, filterLevel, allAreas]);

  const areas = ["all", ...allAreas.map((a) => a.nombre)];
  const availableLevels =
    filterArea === "all"
      ? []
      : allAreas
          .find((a) => a.nombre === filterArea)
          ?.niveles.map((n) => n.nombre_nivel) || [];

  // Exportar todos los competidores según filtros
  const handleExport = async () => {
    try {
      const params = {
        busqueda: searchTerm,
        id_area:
          filterArea === "all"
            ? null
            : allAreas.find((a) => a.nombre === filterArea)?.id,
        id_nivel:
          filterLevel === "all"
            ? null
            : allAreas
                .find((a) => a.nombre === filterArea)
                ?.niveles.find((n) => n.nombre_nivel === filterLevel)?.id,
        per_page: pagination.total || 1000, // traer todos los registros
        page: 1,
      };
      const res = await EvaluacionesRepository.filtrarEvaluaciones(params);
      const allCompetitors = res.data;
      const filename = exportToPDF(allCompetitors, filterArea, filterLevel);
      setSuccessMessage(`La lista se ha descargado como "${filename}"`);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchCompetitors(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lista Oficial de Habilitados - Fase Final
          </h1>
          <p className="text-gray-600">
            Competidores transferidos automáticamente desde la fase
            clasificatoria
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-cta flex items-center gap-2 px-4 py-2"
          disabled={loading || !competitors.length}
        >
          Exportar Lista
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterArea}
          onChange={(e) => {
            setFilterArea(e.target.value);
            setFilterLevel("all");
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area === "all" ? "Todas las áreas" : area}
            </option>
          ))}
        </select>
        {filterArea !== "all" && (
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los niveles</option>
            {availableLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Cargando...</div>
        ) : competitors.length ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota Clasificatoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitors.map((comp) => (
                <tr key={comp.id_inscrito} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comp.id_inscrito}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp.nivel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp["grado "]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp.nota}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comp.estado_clasificado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No hay competidores habilitados.
          </div>
        )}
      </div>

      {/* Paginación */}
      {competitors.length > 0 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            className="px-4 py-2 border rounded"
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            Anterior
          </button>
          <span className="px-4 py-2 border rounded">
            Página {pagination.current_page} de {pagination.last_page}
          </span>
          <button
            className="px-4 py-2 border rounded"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de Éxito */}
      <SuccessDialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Exportación Exitosa"
        subtitle="La lista se descargó correctamente"
        message={successMessage}
        confirmLabel="Aceptar"
      />
    </div>
  );
};

export default OfficialListPage;
