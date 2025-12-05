// src/pages/dashboard/evaluador/pages/EvaluadorHome.jsx
import { useState } from "react";
import EvaluacionesTable from "../components/EvaluacionesTable.jsx";
import FiltroEvaluaciones from "../components/FiltroEvaluaciones.jsx";

export default function EvaluadorHome({
  idAreaNivelFase,
  nombreNivel,
  estadoNivel,
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ by: "nombre", dir: "asc" });

  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Calificación de competidores{" "}
          {nombreNivel ? `del Nivel ${nombreNivel}` : ""}
        </h1>
        <p className="text-gray-500">
          Registra calificaciones y observaciones.
        </p>
      </header>

      {/* Buscador + Orden (sin chips ni export) */}
      <div className="mb-4">
        <FiltroEvaluaciones
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <EvaluacionesTable
          opcion_tabla="" // ← todos (no enviar “todos” al backend)
          esClasificados={false}
          idAreaNivelFase={idAreaNivelFase}
          estadoNivel={estadoNivel}
          mode="notas"
          showToolbar={false} // usamos los filtros externos
          query={query}
          sort={sort}
        />
      </section>
    </div>
  );
}
