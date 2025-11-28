import React, { useState } from "react";
import { FaTrophy, FaCheckCircle, FaGlobe, FaFileAlt, FaBullhorn } from "react-icons/fa";
import { PiGraduationCapFill } from "react-icons/pi";

// Datos de prueba
const MOCK_AREAS = [
  {
    id: 1,
    nombre: "Matemáticas",
    participantes: 45,
    nivel: "Primaria",
    badges: ["Clasificatoria", "Confirmado", "✓ Con Aval"],
    acciones: ["Generar Listas", "Publicar Resultados"]
  },
  {
    id: 2,
    nombre: "Matemáticas",
    participantes: 67,
    nivel: "Secundaria",
    badges: ["Clasificatoria", "En evaluación"],
    acciones: []
  }
];

export default function PanelAdministrativo() {
  const [areas] = useState(MOCK_AREAS);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
          <p className="text-gray-500 text-base">
            Control general del sistema de olimpiadas - gestión de fases y publicación de resultados
          </p>
        </header>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Clasificados"
            sublabel="Estudiantes clasificados"
            value={145}
            icon={<PiGraduationCapFill size={28} />}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            label="Premiados"
            sublabel="Estudiantes premiados"
            value={48}
            icon={<FaTrophy size={24} />}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            label="Áreas con Aval"
            sublabel="De 8 áreas totales"
            value={4}
            icon={<FaCheckCircle size={24} />}
            color="text-green-500"
            bgColor="bg-green-50"
          />
          <StatCard
            label="Listas para Publicar"
            sublabel="Confirmados y con aval"
            value={3}
            icon={<FaGlobe size={24} />}
            color="text-purple-500"
            bgColor="bg-purple-50"
          />
        </div>

        {/* CONTROL DE ÁREAS Y FASES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Control de Áreas y Fases</h2>
          <p className="text-gray-500 text-sm mb-6">
            Gestión del estado por área, nivel y fase - Generación y publicación de listas
          </p>

          <div className="space-y-4">
            {areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Componente de tarjeta de estadística
function StatCard({ label, sublabel, value, icon, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-500 text-xs">{sublabel}</p>
    </div>
  );
}

// Componente de tarjeta de área
function AreaCard({ area }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200">
      
      {/* Título */}
      <h3 className="text-xl font-bold text-gray-800 mb-3">{area.nombre}</h3>
      
      {/* Info y badges en la misma línea */}
      <div className="flex items-center gap-4 mb-4">
        <p className="text-sm text-gray-500">
          {area.participantes} participantes • {area.nivel}
        </p>
        
        {/* Badges de estado */}
        <div className="flex gap-2 flex-wrap">
          {area.badges.map((badge, index) => (
            <Badge key={index} text={badge} />
          ))}
        </div>
      </div>

      {/* Botones de acción (solo si hay acciones) */}
      {area.acciones.length > 0 && (
        <div className="flex gap-3">
          {area.acciones.includes("Generar Listas") && (
            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <FaFileAlt size={14} />
              Generar Listas
            </button>
          )}
          {area.acciones.includes("Publicar Resultados") && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
              <FaBullhorn size={14} />
              Publicar Resultados
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Componente de badge
function Badge({ text }) {
  let colors = "bg-cyan-50 text-cyan-600 border-cyan-200";
  
  if (text.includes("Confirmado")) {
    colors = "bg-green-50 text-green-600 border-green-200";
  } else if (text.includes("✓ Con Aval")) {
    colors = "bg-green-50 text-green-600 border-green-200";
  } else if (text.includes("evaluación")) {
    colors = "bg-blue-50 text-blue-600 border-blue-200";
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors}`}>
      {text}
    </span>
  );
}