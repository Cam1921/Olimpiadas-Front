import { useMemo, useState } from "react";
import { AREAS, getLevelsForArea } from "../constants";

export function useFilters() {
  const [fase, setFase] = useState("clasificatoria"); // "clasificatoria" | "final"
  const [area, setArea] = useState("Todas las áreas");
  const [nivel, setNivel] = useState("Todos los niveles");

  const nivelesDisponibles = useMemo(() => getLevelsForArea(area), [area]);

  const handleSetArea = (a) => {
    setArea(a);
    setNivel("Todos los niveles");
  };

  return {
    fase, setFase,
    area, setArea: handleSetArea,
    nivel, setNivel,
    nivelesDisponibles,
    areasDisponibles: ["Todas las áreas", ...AREAS],
  };
}
