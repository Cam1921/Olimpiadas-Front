// src/components/asignar-competidores/PreviewDistribucion.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PreviewDistribucion() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    areaId,
    nivelId,
    limiteEvaluadoresActivos,
    limitePorEvaluador,
  } = state ?? {};

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold text-slate-800">Previsualización</h1>
        <p className="mt-2 text-slate-600">
          No recibí parámetros. Vuelve a la página anterior y completa los filtros.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-slate-800">Previsualización de distribución</h1>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Área</p>
          <p className="text-lg font-semibold">{areaId}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Nivel</p>
          <p className="text-lg font-semibold">{nivelId}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Evaluadores activos</p>
          <p className="text-lg font-semibold">{limiteEvaluadoresActivos}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Cupo por evaluador</p>
          <p className="text-lg font-semibold">{limitePorEvaluador}</p>
        </div>
      </div>
    </div>
  );
}
