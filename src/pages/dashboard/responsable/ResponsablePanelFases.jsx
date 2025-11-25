import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaCheckCircle, FaClipboardList } from "react-icons/fa";

// ==========================================
// DATOS DE PRUEBA (MOCK DATA)
// ==========================================
const MOCK_AREAS = [
  { id: 1, nombre: "Robótica" },
  { id: 2, nombre: "Física" },
  { id: 3, nombre: "Matemáticas" }
];

const MOCK_NIVELES = [
  { id: 1, nombre: "Secundaria" },
  { id: 2, nombre: "Bachillerato" },
  { id: 3, nombre: "Cuarto nivel" },
  { id: 4, nombre: "Tercer nivel" }
];

const MOCK_FASES = [
  // Robótica - Secundaria
  {
    id: 1,
    areaId: 1,
    nivelId: 1,
    area: "Robótica",
    participantes: 35,
    fase: "Clasificación",
    nivel: "Secundaria",
    estado: "Con Aval"
  },
  {
    id: 2,
    areaId: 1,
    nivelId: 1,
    area: "Robótica",
    participantes: 28,
    fase: "Final",
    nivel: "Secundaria",
    estado: "Con Aval"
  },
  // Robótica - Bachillerato
  {
    id: 3,
    areaId: 1,
    nivelId: 2,
    area: "Robótica",
    participantes: 42,
    fase: "Clasificación",
    nivel: "Bachillerato",
    estado: "Pendiente"
  },
  // Física - Secundaria
  {
    id: 4,
    areaId: 2,
    nivelId: 1,
    area: "Física",
    participantes: 50,
    fase: "Clasificación",
    nivel: "Secundaria",
    estado: "Con Aval"
  },
  // Matemáticas - Cuarto nivel
  {
    id: 5,
    areaId: 3,
    nivelId: 3,
    area: "Matemáticas",
    participantes: 45,
    fase: "Clasificación",
    nivel: "Cuarto nivel",
    estado: "Con Aval"
  },
  // Matemáticas - Tercer nivel
  {
    id: 6,
    areaId: 3,
    nivelId: 4,
    area: "Matemáticas",
    participantes: 67,
    fase: "Clasificación",
    nivel: "Tercer nivel",
    estado: "Pendiente"
  }
];
// ==========================================

export default function ResponsablePanelFases() {
  const [areas, setAreas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [allFases, setAllFases] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedNivel, setSelectedNivel] = useState("");

  useEffect(() => {
    // Cargar datos mock
    setAreas(MOCK_AREAS);
    setNiveles(MOCK_NIVELES);
    setAllFases(MOCK_FASES);
    
    // Seleccionar por defecto
    if (MOCK_AREAS.length > 0) setSelectedArea(MOCK_AREAS[0].id);
    if (MOCK_NIVELES.length > 0) setSelectedNivel(MOCK_NIVELES[0].id);
  }, []);

  // Filtrar fases según área y nivel seleccionados
  const fasesFiltradas = allFases.filter(
    fase => fase.areaId === parseInt(selectedArea) && fase.nivelId === parseInt(selectedNivel)
  );

  // Calcular estadísticas dinámicas basadas en la selección actual
  const calcularStats = () => {
    // Total de participantes del área/nivel seleccionado
    const totalParticipantes = fasesFiltradas.reduce((sum, fase) => sum + fase.participantes, 0);
    
    // Contar áreas con aval (todas las fases tienen "Con Aval")
    const fasesConAval = fasesFiltradas.filter(f => f.estado === "Con Aval").length;
    const totalFases = fasesFiltradas.length;
    
    // Progreso general basado en fases con aval
    const progresoGeneral = totalFases > 0 ? Math.round((fasesConAval / totalFases) * 100) : 0;

    return {
      totalParticipantes,
      areasConAval: fasesConAval,
      totalAreas: totalFases,
      progresoGeneral
    };
  };

  const stats = calcularStats();

  const handleVerPlanilla = (faseId) => {
    console.log(`Ver planilla de fase: ${faseId}`);
    alert(`Abriendo planilla de notas...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SIN RECUADRO */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Panel del Responsable de</h1>
          <p className="text-base text-gray-900 font-medium mt-1">Gestiona tus Fases</p>
        </header>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard 
            label="Participantes totales"
            value={stats.totalParticipantes || 0}
            icon={<FaGraduationCap size={20} className="text-blue-600" />}
          />
          <StatCard 
            label="Áreas con Aval"
            value={`${stats.areasConAval || 0}/${stats.totalAreas || 0}`}
            icon={<FaCheckCircle size={20} className="text-green-600" />}
          />
          <StatCard 
            label="Progreso general"
            value={`${stats.progresoGeneral || 0}%`}
            icon={<svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 13h4v8H3zM10 9h4v12h-4zM17 5h4v16h-4z"/>
            </svg>}
            showProgress={true}
            progressValue={stats.progresoGeneral || 0}
          />
        </div>

        {/* SECCIÓN DE CONTROL DE FASES */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Control de Fases</h2>
              <p className="text-sm text-gray-500 mt-1">
                Seleccione un nivel/área para ver la planilla de notas
              </p>
            </div>
            
            {/* SELECTORES */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                className="border-gray-300 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[140px]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>

              <select 
                className="border-gray-300 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[140px]"
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
              >
                {niveles.map(nivel => (
                  <option key={nivel.id} value={nivel.id}>{nivel.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTA DE FASES */}
          <div className="p-6 space-y-4">
            {fasesFiltradas.length > 0 ? (
              fasesFiltradas.map((fase) => (
                <FaseCard 
                  key={fase.id}
                  fase={fase}
                  onVerPlanilla={() => handleVerPlanilla(fase.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No hay fases disponibles para esta selección</p>
                <p className="text-sm mt-2">Selecciona otra área o nivel</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

// Componente de tarjetas de estadísticas
function StatCard({ label, value, icon, showProgress = false, progressValue = 0 }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <div className="p-2.5 rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-blue-600 mb-3">{value}</p>
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Componente de tarjeta de fase
function FaseCard({ fase, onVerPlanilla }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
        {/* Área y participantes */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{fase.area}</h3>
          <p className="text-sm text-gray-500">{fase.participantes} participantes</p>
        </div>

        {/* Fase */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-1">Fase:</p>
          <p className="text-sm font-medium text-gray-700">{fase.fase}</p>
        </div>

        {/* Nivel */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-1">Nivel:</p>
          <p className="text-sm font-medium text-gray-700">{fase.nivel}</p>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2">
          {fase.estado === "Con Aval" ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <FaCheckCircle className="mr-1.5" size={12} />
              Con Aval
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              Pendiente
            </span>
          )}
        </div>
      </div>

      {/* Botón */}
      <button
        onClick={onVerPlanilla}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <FaClipboardList size={16} />
        Ver Planilla de Notas
      </button>
    </div>
  );
}