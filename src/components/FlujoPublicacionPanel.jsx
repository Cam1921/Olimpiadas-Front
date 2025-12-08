// src/components/FlujoPublicacionPanel.jsx
import { useState } from "react";

export default function FlujoPublicacionPanel({ areas = [] }) {
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const getColorChip = (estado) => {
    switch (estado) {
      case "En evaluacion":
        return "bg-blue-100 text-blue-800";
      case "Concluido":
        return "bg-green-100 text-green-800";
      case "Confirmado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getButtonClass = (estadoActual, estadoBoton) => {
    const isActive = estadoActual === estadoBoton;
    if (!isActive)
      return "bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed";
    return estadoBoton === "Confirmado"
      ? "bg-purple-500 text-white border-purple-600"
      : estadoBoton === "Concluido"
      ? "bg-green-500 text-white border-green-600"
      : "bg-blue-500 text-white border-blue-600";
  };

  return (
    <div className="space-y-4">
      {/* 👇 Título y subtítulo */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 leading-tight">
          Estado de Fases por Área
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Cambia el estado para habilitar impresión y publicación
        </p>
      </div>

      {/* Tarjetas por área */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <div key={area.id} className="card p-4">
            <h3 className="font-medium text-slate-800">{area.nombre}</h3>
            <div className="mt-1">
              <span
                className={`inline-block px-2 py-0.5 text-xs rounded-full ${getColorChip(
                  area.estado
                )}`}
              >
                {area.estado}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(
                  area.estado,
                  "En evaluación"
                )}`}
                disabled={area.estado !== "En evaluación"}
              >
                En evaluación
              </button>
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(
                  area.estado,
                  "Concluido"
                )}`}
                disabled={area.estado !== "Concluido"}
              >
                Concluido
              </button>
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(
                  area.estado,
                  "Confirmado"
                )}`}
                disabled={area.estado !== "Confirmado"}
              >
                Confirmado
              </button>
            </div>

          </div>
        ))}
      </div>

      
    </div>
  );
}