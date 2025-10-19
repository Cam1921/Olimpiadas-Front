// src/pages/dashboard/evaluador/pages/EvaluadorHome.jsx
import EvaluacionesTable from "../components/EvaluacionesTable.jsx";

export default function EvaluadorHome() {
  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Calificación de competidores
        </h1>
        <p className="text-gray-500">
          Registra las calificaciones y observaciones de los competidores asignados.
        </p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <EvaluacionesTable />
      </section>
    </div>
  );
}
