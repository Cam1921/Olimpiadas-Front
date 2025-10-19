import { useState } from "react";
import EvaluacionesTable from "../components/EvaluacionesTable.jsx";

export default function EvaluadorHome() {
  const [estado, setEstado] = useState("todos");
  const [esClasificados, setEsClasificados] = useState(false);
  const opciones = [
    { label: "Todos", value: "todos" },
    { label: "Clasificados", value: "clasificados" },
    { label: "No Clasificados", value: "no_clasificados" },
    { label: "Descalificados", value: "descalificados" },
  ];
  const handleFiltro = (value) => {
    console.log(value);
    if (value !== "todos") {
      setEsClasificados(true);
    } else {
      setEsClasificados(false);
    }
    console.log(esClasificados);
    setEstado(value);
  };

  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Calificación de competidores
        </h1>
        <p className="text-gray-500">
          Registra las calificaciones y observaciones de los competidores
          asignados.
        </p>
      </header>
      <div className="mb-4 flex gap-2">
        {opciones.map((op) => (
          <button
            key={op.value}
            onClick={() => handleFiltro(op.value)}
            className={`px-4 py-2 rounded font-medium ${
              estado === op.value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <EvaluacionesTable
          opcion_tabla={estado}
          esClasificados={esClasificados}
        />
      </section>
    </div>
  );
}
