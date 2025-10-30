// src/pages/TestControlFases.jsx
import { useEffect, useState } from "react";
import ControlFasesTable from "../components/ControlFasesTable";

export default function TestControlFases() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos desde el backend
  useEffect(() => {
    async function fetchEstados() {
      try {
        const res = await fetch("/api/estados");
        const json = await res.json();

        if (
          json.success &&
          json.data &&
          Array.isArray(json.data.data) &&
          Array.isArray(json.data.data[0])
        ) {
          const mapped = json.data.data[0].map((item) => ({
            id: item.id_area_nivel_fase,
            nombre: item.area,
            nivel: item.nivel,
            faseActual: item.fase,
            progreso: parseInt(
              item.progreso_evaluacion.progreso.replace("%", "")
            ),
            clasificados: item.resumen_evaluaciones.clasificados,
            noClasificados: item.resumen_evaluaciones.no_clasificados,
            descalificados: item.resumen_evaluaciones.desclasificados,
            responsable: item.responsable?.trim() || "No asignado",
            estado: item.estado.replace("_", " "), // Ej: En_evaluacion → En evaluación
          }));

          setAreas(mapped);
        } else {
          console.error("Estructura inesperada del API:", json);
        }
      } catch (error) {
        console.error("Error obteniendo los estados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEstados();
  }, []);

  // 🔹 Esta función actualiza la fila sin recargar toda la página
  const handleEstadoActualizado = ({ id, estado }) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, estado } : a)));
  };

  if (loading) return <div className="p-6">Cargando datos...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Control de Fases</h1>
      <ControlFasesTable
        areas={areas}
        rolUsuario="Administrador"
        onEstadoActualizado={handleEstadoActualizado} // 👈 Aquí se pasa el callback
      />
    </div>
  );
}
