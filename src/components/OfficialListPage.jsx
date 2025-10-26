// src/components/OfficialListPage.jsx
import React, { useState } from 'react';
import { NIVELES_POR_AREA } from '../utils/areaUtils';
import SuccessDialog from './SuccessDialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportToPDF = (competitors, filterArea, filterLevel) => {
  const doc = new jsPDF();
  const filename = `Lista_Habilitados_${filterArea || "Todas"}_${filterLevel || "Todos"}.pdf`;

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Lista Oficial de Habilitados - Fase Final', 14, 20);

  // Subtítulo con filtros
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Área: ${filterArea === "all" ? "Todas" : filterArea}`, 14, 30);
  doc.text(`Nivel: ${filterLevel === "all" ? "Todos" : filterLevel}`, 14, 35);

  // Tabla
  autoTable(doc, {
    startY: 45,
    head: [['ID', 'Nombre', 'Área', 'Nivel', 'Curso', 'Nota Clasificatoria', 'Fecha Clasific.']],
    body: competitors.map(c => [
      c.id,
      c.name,
      c.area,
      c.level,
      c.course,
      c.score,
      c.date
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [2, 132, 199], // color-cta: #0284C7
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [245, 247, 249]
    }
  });

  // Guardar PDF
  doc.save(filename);
  return filename;
};

const OfficialListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Datos simulados
  const competitors = [
    {
      id: "EST001",
      name: "María González Pérez",
      area: "Matemáticas",
      level: "Tercer Nivel",
      course: "6to A",
      score: 95,
      date: "2025-01-15"
    },
    {
      id: "EST002",
      name: "Carlos Mamani Quispe",
      area: "Física",
      level: "4to Secundaria",
      course: "4to B",
      score: 88,
      date: "2025-01-16"
    },
    {
      id: "EST003",
      name: "Ana López Sánchez",
      area: "Matemáticas",
      level: "Segundo Nivel",
      course: "5to C",
      score: 92,
      date: "2025-01-14"
    },
    {
      id: "EST004",
      name: "Luis Torres Rojas",
      area: "Física",
      level: "3ro Secundaria",
      course: "3ro D",
      score: 85,
      date: "2025-01-17"
    }
  ];

  const areas = ["all", ...new Set(competitors.map(c => c.area))];
  const availableLevels = filterArea === "all" 
    ? [] 
    : NIVELES_POR_AREA[filterArea] || [];

  const filteredCompetitors = competitors.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === "all" || comp.area === filterArea;
    const matchesLevel = filterLevel === "all" || comp.level === filterLevel;
    return matchesSearch && matchesArea && matchesLevel;
  });

  const handleExport = () => {
    const filename = exportToPDF(filteredCompetitors, filterArea, filterLevel);
    setSuccessMessage(`La lista se ha descargado como "${filename}"`);
    setShowSuccessModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lista Oficial de Habilitados - Fase Final</h1>
          <p className="text-gray-600">Competidores transferidos automáticamente desde la fase clasificatoria</p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-cta flex items-center gap-2 px-4 py-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2z" />
          </svg>
          Exportar Lista
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={filterArea}
          onChange={(e) => {
            setFilterArea(e.target.value);
            setFilterLevel("all");
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las áreas</option>
          {areas.filter(a => a !== "all").map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        {filterArea !== "all" && (
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los niveles</option>
            {availableLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Clasificatoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Clasific</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCompetitors.map((comp, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.area}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.course}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {comp.score}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500">
        Mostrando {filteredCompetitors.length} habilitados
      </div>

      {/* Botón volver al Dashboard */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.href = "/entorno-final"}
          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
        >
          Volver al Entorno Final
        </button>
      </div>

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