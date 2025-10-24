import { useState } from "react";
import EvaluacionesTable from "../components/EvaluacionesTable.jsx";
import api from "@/lib/api";
import { FileDown } from "lucide-react";

export default function EvaluadorHome() {
  const [estado, setEstado] = useState("todos");
  const [esClasificados, setEsClasificados] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const opciones = [
    { label: "Todos", value: "todos" },
    { label: "Clasificados", value: "clasificados" },
    { label: "No Clasificados", value: "no_clasificados" },
    { label: "Descalificados", value: "descalificados" },
  ];

  const handleFiltro = (value) => {
    if (value !== "todos") {
      setEsClasificados(true);
    } else {
      setEsClasificados(false);
    }
    setEstado(value);
  };

  const handleExportarExcel = async () => {
    try {
      const params = {};

      if (estado && estado !== "todos") params.estado_clasificado = estado;

      // Llamada al backend usando Axios
      const response = await api.get("evaluador/evaluaciones/exportar", {
        params,
        responseType: "blob", // 👈 clave para que descargue binario (Excel)
      });

      // Crear blob y disparar descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `evaluaciones_${estado}_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", "_")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      alert("Hubo un problema al exportar las evaluaciones.");
    }
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

      {/* Filtros */}
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex flex-wrap gap-2 ">
          {opciones.map((op) => (
            <button
              key={op.value}
              onClick={() => handleFiltro(op.value)}
              className={`px-4 py-2 rounded-xl font-medium ${
                estado === op.value
                  ? "hover:bg-[var(--primary)] bg-[var(--primary)] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportarExcel}
          className="border-gray-300 text-gray-500 border-2 px-4 py-2 flex flex-row gap-2 rounded-lg font-medium shadow-sm"
        >
          <span>
            <FileDown size={20} />
          </span>{" "}
          Exportar Evaluaciones
        </button>
      </div>

      {/* Tabla */}
      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <EvaluacionesTable
          opcion_tabla={estado}
          esClasificados={esClasificados}
          busqueda={busqueda}
        />
      </section>
    </div>
  );
}
