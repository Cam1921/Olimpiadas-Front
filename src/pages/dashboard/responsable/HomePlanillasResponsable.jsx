// src/pages/dashboard/responsable/HomePlanillasResponsable.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import EvaluadorHome from "../evaluador/pages/EvaluadorHome";
import { FileSpreadsheet } from "lucide-react";
import ControlFasesArea from "./ControlFasesArea";

// Componente principal: Calificación de Competidores
// Requiere TailwindCSS configurado en el proyecto

export default function HomePlanillasResponsable() {
  const [filter, setFilter] = useState("all");
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNivel, setSelectedNivel] = useState(null);

  const fetchNiveles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/evaluaciones/mis-niveles");

      // Protegemos contra respuestas no esperadas
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Niveles recibidos:", data);

      const adaptedData = data.map((item) => ({
        id: item.id_area_nivel_fase, // 👈 este es el campo correcto en tu JSON
        title: item.area,
        fase: item.fase,
        nivel: item.nivel,
        total: item.progreso_evaluacion.total,
        evaluados: item.progreso_evaluacion.evaluados,
        estado: item.estado,
      }));
      console.log(adaptedData);
      setAreas(adaptedData);
    } catch (err) {
      console.error("Error al cargar área con niveles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiveles();
  }, []);
  /*   const areas = [
    {
      id: "MAT-PRIM-001",
      title: "Matemáticas",
      fase: "clasificatoria",
      nivel: "Primaria",
      total: 3,
      evaluados: 3,
    },
    {
      id: "MAT-SEC-001",
      title: "Matemáticas",
      fase: "clasificatoria",
      nivel: "Secundaria",
      total: 1,
      evaluados: 1,
    },
    {
      id: "CIE-SEC-001",
      title: "Ciencias",
      fase: "final",
      nivel: "Secundaria",
      total: 2,
      evaluados: 1,
    },
    {
      id: "FIS-PRIM-001",
      title: "Física",
      fase: "final",
      nivel: "Primaria",
      total: 5,
      evaluados: 2,
    },
    {
      id: "BIO-SEC-001",
      title: "Biología",
      fase: "clasificatoria",
      nivel: "Secundaria",
      total: 4,
      evaluados: 4,
    },
  ]; */

  const filtered = useMemo(() => {
    if (!areas) return [];
    if (filter === "all") return areas;

    if (filter === "clasificatoria")
      return areas.filter(
        (a) => a.fase.toLowerCase() === "clasificacion".toLowerCase()
      );

    if (filter === "final")
      return areas.filter(
        (a) => a.fase.toLowerCase() === "final".toLowerCase()
      );

    return areas;
  }, [filter, areas]);

  if (selectedNivel) {
    console.log(selectedNivel);
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setSelectedNivel(null);
            fetchNiveles();
          }}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          ← Volver a mis Niveles
        </button>
        <ControlFasesArea
          idAreaNivelFase={selectedNivel.id}
          nombreNivel={selectedNivel.nivel}
          nombreFase={selectedNivel.fase}
          estadoFase={selectedNivel.estado}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">
              Calificación de Competidores
            </h1>
            <p className="text-slate-500 mt-1">
              Seleccione un nivel/área para ver la planilla de notas
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-white shadow p-1">
            <FilterPill
              label="Todas las fases"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterPill
              label="Fase Clasificatoria"
              active={filter === "clasificatoria"}
              onClick={() => setFilter("clasificatoria")}
            />
            <FilterPill
              label="Fase Final"
              active={filter === "final"}
              onClick={() => setFilter("final")}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500">Cargando niveles...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-500">
            No hay áreas disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                onVerPlanilla={setSelectedNivel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-white shadow ring-2 ring-blue-400 text-blue-700"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function AreaCard({ area, onVerPlanilla }) {
  const pendientes = Math.max(area.total - area.evaluados, 0);
  const percent =
    area.total === 0 ? 0 : Math.round((area.evaluados / area.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-transparent hover:shadow-md transition p-6 relative">
      {/* Icono superior derecho */}
      <div className="absolute top-4 right-4 p-1 rounded-md bg-white/80">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sky-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.84 6.404L12 20.5 4.999 17.0a12.083 12.083 0 01.84-6.404L12 14z"
            opacity=".4"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800">{area.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <div className="text-xs text-slate-400">Fase:</div>
            <div className="mt-1 flex items-center gap-2">
              <PhaseBadge fase={area.fase} />
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Nivel:</div>
            <div className="mt-1 text-sm text-slate-700">{area.nivel}</div>
          </div>
          <div className="col-span-2 border-t pt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Estado:</span>
              <span className="font-medium text-slate-800">
                {" "}
                <StatusBadge estado={area.estado} />
              </span>
            </div>
          </div>

          {/*  <div className="col-span-2 border-t pt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Nro de competidores:</span>
              <span className="font-medium text-slate-800">{area.total}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Evaluados:</span>
              <span className="font-medium text-green-600">
                {area.evaluados} ({percent}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Pendientes:</span>
              <span
                className={`font-medium ${
                  pendientes > 0 ? "text-amber-600" : "text-slate-500"
                }`}
              >
                {pendientes}
              </span>
            </div>
          </div> */}

          <div className="col-span-2 mt-4">
            <button
              onClick={() => onVerPlanilla(area)}
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md shadow"
            >
              <FileSpreadsheet />
              Ver Planilla de Notas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseBadge({ fase }) {
  const lower = (fase || "").toLowerCase();
  const isClas = lower === "clasificatoria";
  const isFinal = lower === "final";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        isClas
          ? "bg-blue-50 text-blue-700"
          : isFinal
          ? "bg-purple-50 text-purple-700"
          : "bg-gray-100 text-slate-700"
      }`}
    >
      {isClas ? "Clasificatoria" : isFinal ? "Final" : fase}
    </span>
  );
}
function StatusBadge({ estado }) {
  // Normaliza el texto
  const lower = (estado || "").toLowerCase().trim();

  // Define los estados
  const isPendiente = lower === "pendiente";
  const isEnEvaluacion = lower === "en_evaluacion";
  const isEnProceso = lower === "en proceso";
  const isConfirmado = lower === "confirmado";
  const isConcluido = lower === "concluido";

  // Convierte el texto para mostrar (reemplaza guiones o guiones bajos)
  const displayText =
    estado
      ?.replace(/^./, (l) => l.toUpperCase())
      ?.replace(/_/g, " ") // reemplaza _ por espacio
      ?.trim() || "Desconocido";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        isPendiente
          ? "bg-yellow-50 text-yellow-700"
          : isConcluido
          ? "bg-blue-50 text-blue-700"
          : isEnProceso
          ? "bg-indigo-50 text-indigo-700"
          : isConfirmado
          ? "bg-green-50 text-green-700"
          : isEnEvaluacion
          ? "bg-gray-200 text-gray-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {displayText}
    </span>
  );
}
