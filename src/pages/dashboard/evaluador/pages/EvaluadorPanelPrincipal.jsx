import React, { useState, useEffect } from "react";
// Se eliminó FaExclamationTriangle de los imports porque ya no se usa
import { FaUserGraduate, FaUsers, FaClipboardList } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";

// ==========================================
// DATOS DE PRUEBA (MOCK DATA)
// ==========================================
const MOCK_AREAS_ASIGNADAS = [
  {
    id: 101,
    nombre: "Robótica",
    modalidad: "mixta",
    niveles: [
      { id: 1, nombre: "Secundaria", pendientes: 5, evaluados: 12, total: 17 },
      { id: 2, nombre: "Bachillerato", pendientes: 0, evaluados: 10, total: 10 },
    ],
    // Aunque dejemos los datos aquí, ya no se mostrarán en pantalla
    alertas: [
      { id: 1, mensaje: "3 evaluaciones sin guardar en Secundaria" },
      { id: 2, mensaje: "Equipo 'Alpha' tiene documentación incompleta" }
    ]
  },
  {
    id: 102,
    nombre: "Física",
    modalidad: "individual",
    niveles: [
      { id: 3, nombre: "General", pendientes: 20, evaluados: 5, total: 25 },
    ],
    alertas: []
  }
];
// ==========================================

export default function EvaluadorPanelPrincipal() {
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedNivelId, setSelectedNivelId] = useState(null);

  useEffect(() => {
    setAreas(MOCK_AREAS_ASIGNADAS);
    
    if (MOCK_AREAS_ASIGNADAS.length > 0) {
      setSelectedAreaId(MOCK_AREAS_ASIGNADAS[0].id);
      if (MOCK_AREAS_ASIGNADAS[0].niveles.length > 0) {
        setSelectedNivelId(MOCK_AREAS_ASIGNADAS[0].niveles[0].id);
      }
    }
  }, []);

  const currentArea = areas.find(a => a.id === parseInt(selectedAreaId));
  const currentNivel = currentArea?.niveles.find(n => n.id === parseInt(selectedNivelId));

  const handleNavigate = (ruta) => {
    console.log(`Navegando a: ${ruta} con Área: ${currentArea?.nombre} y Nivel: ${currentNivel?.nombre}`);
    alert(`Redirigiendo a vista de: ${ruta}`);
  };

  if (!currentArea) return <div className="p-6">Cargando información asignada...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SIN RECUADRO */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Evaluación</h1>
          <p className="text-gray-600 text-sm mt-1">Gestiona tus evaluaciones asignadas</p>
        </header>

        {/* RESUMEN DE PROGRESO - NUEVO DISEÑO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard 
            label="Evaluaciones completados" 
            value={`${currentNivel?.evaluados || 0}/${currentNivel?.total || 0}`}
            color="text-blue-600" 
            icon={<BsCheckCircleFill size={20} className="text-blue-600" />}
          />
          <StatCard 
            label="Áreas concluidos" 
            value={areas.filter(a => a.niveles.every(n => n.pendientes === 0)).length}
            color="text-blue-600" 
            icon={<svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>}
          />
          <StatCard 
            label="Progreso general" 
            value={`${Math.round(((currentNivel?.evaluados || 0) / (currentNivel?.total || 1)) * 100)}%`}
            color="text-blue-600" 
            icon={<svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 13h4v8H3zM10 9h4v12h-4zM17 5h4v16h-4z"/>
            </svg>}
            showProgress={true}
            progressValue={Math.round(((currentNivel?.evaluados || 0) / (currentNivel?.total || 1)) * 100)}
          />
        </div>


        {/* SECCIÓN DE ACCIONES / MODALIDAD */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Selecciona modalidad de calificación</h2>
              <p className="text-sm text-gray-600 mt-1">
                Para el área de <span className="font-semibold text-blue-600">{currentArea.nombre}</span>
              </p>
            </div>
            
            {/* SELECTORES MOVIDOS AQUÍ */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                className="border-gray-300 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={selectedAreaId}
                onChange={(e) => {
                  const newAreaId = e.target.value;
                  setSelectedAreaId(newAreaId);
                  const newArea = areas.find(a => a.id == newAreaId);
                  if(newArea?.niveles.length > 0) setSelectedNivelId(newArea.niveles[0].id);
                }}
              >
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>

              <select 
                className="border-gray-300 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={selectedNivelId || ""}
                onChange={(e) => setSelectedNivelId(e.target.value)}
              >
                {currentArea.niveles.map(nivel => (
                  <option key={nivel.id} value={nivel.id}>{nivel.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-10 flex flex-wrap gap-8 justify-center">
            
            {/* BOTÓN INDIVIDUAL */}
            <button 
              onClick={() => handleNavigate('individual')}
              className="group flex flex-col items-center justify-center w-56 h-48 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full text-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 mb-4">
                <FaUserGraduate size={40} />
              </div>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Individual</span>
            </button>

            {/* BOTÓN POR EQUIPOS */}
            {currentArea.modalidad !== "individual" && (
              <button 
                onClick={() => handleNavigate('equipos')}
                className="group flex flex-col items-center justify-center w-56 h-48 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full text-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 group-hover:text-white transition-all duration-300 mb-4">
                  <FaUsers size={40} />
                </div>
                <span className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Por Equipos</span>
              </button>
            )}

          </div>
          
          {currentArea.modalidad === "individual" && (
            <div className="px-6 pb-6 pt-2">
               <p className="text-xs text-gray-500 italic text-center">
                 Nota: Esta área solo admite evaluación individual.
               </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

// Componente de tarjetas de estadísticas con nuevo diseño
function StatCard({ label, value, color, icon, showProgress = false, progressValue = 0 }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <div className="p-2.5 rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
      <p className={`text-4xl font-bold ${color} mb-3`}>{value}</p>
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