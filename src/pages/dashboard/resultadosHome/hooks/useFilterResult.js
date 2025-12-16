// src/pages/dashboard/publicacion/hooks/useFilters.js
import { useMemo, useState, useEffect } from "react";
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import { faseService } from "@/services/faseService";

export function useFilters() {
  const [fase, setFase] = useState([]); // "clasificatoria" | "final"
  const [area, setArea] = useState("Todas las áreas");
  const [fases, setFases] = useState([]); 
  const [nivel, setNivel] = useState("Todos los niveles");
  const [dataAreas, setData] = useState([]); // datos del backend
  const [loading, setLoading] = useState(true);  

  // Fetch al backend
  useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await getAreasConNiveles(); // tu endpoint
        
        console.log(res);
        if(res){
           setData(res);       
        }    else{
          console.log("no se obtubo datos de la base de datos");
        }
          
      } catch (err) {
        console.error("Error al conectarse al backend:", err);
      } finally {
        setLoading(false);
      }
    }

     fetchAreas();
     fetchFases()
  }, []);
    async function fetchFases() {
    try {
      const res = await faseService.getAll();
      const f = res.data
      setFases(f || []);
      setFase( f.find(e=>e.nombre=="clasificacion"))
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  // Mapa área → niveles
  const LEVELS_BY_AREA = useMemo(() => {
    const map = {};
    dataAreas.forEach((a) => {
      map[a.nombre] = a.niveles.map((n) => n.nombre_nivel);
    });
    return map;
  }, [dataAreas]);

  // Niveles disponibles según área seleccionada
  const nivelesDisponibles = useMemo(() => {
    if (!area || area === "Todas las áreas") return ["Todos los niveles"];
    return ["Todos los niveles", ...(LEVELS_BY_AREA[area] || [])];
  }, [area, LEVELS_BY_AREA]);

  const handleSetArea = (a) => {
    setArea(a);
    setNivel("Todos los niveles");
  };

  const areasDisponibles = useMemo(
    () => ["Todas las áreas", ...Object.keys(LEVELS_BY_AREA)],
    [LEVELS_BY_AREA]
  );

  return {
    dataAreas,
    fase,
    setFase,
    fases,
    area,
    setArea: handleSetArea,
    nivel,
    setNivel,
    nivelesDisponibles,
    areasDisponibles,
    loading,
  };
}
