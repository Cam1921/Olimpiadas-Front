import { useEffect, useMemo, useState } from "react";
import { COMPETIDORES } from "../constants";

export function usePublicacion({ fase, area, nivel }) {
  const [toast, setToast] = useState(null);

  const data = useMemo(() => {
    if (fase === "final") return []; // Fase final deshabilitada (solo vista)
    let rows = [...COMPETIDORES];
    if (area !== "Todas las áreas") rows = rows.filter(r => r.area === area);
    if (nivel !== "Todos los niveles") rows = rows.filter(r => r.nivel === nivel);
    return rows;
  }, [fase, area, nivel]);

  const generarListas = () => setToast({ type: "success", message: "Listas generadas (mock)." });
  const publicarResultados = () => setToast({ type: "info" });
  const limpiarToast = () => setToast(null);

  useEffect(() => {
    if (fase === "clasificatoria" && data.length === 0) {
     // setToast({ type: "info", message: "No hay clasificados para los filtros actuales." });
    }
  }, [fase, data.length]);

  return { data, toast, generarListas, publicarResultados, limpiarToast };
}
