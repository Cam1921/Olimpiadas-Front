import { useEffect, useState } from "react";
import FlujoPublicacionPanel from "../components/FlujoPublicacionPanel";
import api from "@/lib/api";

export default function TestFlujoPublicacion() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos desde el backend
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await api.get("/areas-fases");
        const data = res.data;

        if (data.success && Array.isArray(data.data)) {
          // Opcional: formatear nombres y estados para mantener coherencia visual
          const formatted = data.data.map((item) => ({
            id: String(item.id),
            nombre:
              item.nombre.charAt(0).toUpperCase() +
              item.nombre.slice(1).toLowerCase(),
            estado: item.estado.replace("_", " "), // Ej. "En_evaluacion" → "En evaluacion"
          }));

          setAreas(formatted);
        }
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando áreas y fases...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resultados y Reportes</h1>
      <FlujoPublicacionPanel areas={areas} />
    </div>
  );
}
