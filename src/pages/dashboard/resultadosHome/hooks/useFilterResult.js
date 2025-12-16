// src/pages/dashboard/publicacion/hooks/useFilters.js
import { useMemo, useState, useEffect } from "react";
import api from "@/lib/api";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository";

export function useFiltersResult() {
  const [data, setData] = useState([]);  
  const [page, setPage] = useState(1); 
  const [lastPage, setLastPage] = useState(1);
 
  const [area, setArea] = useState("Todas las áreas");
  const [nivel, setNivel] = useState("Todos los niveles");
  const [fases,setFases] = useState([]);
  const [fase, setFase] = useState({});
  const [dataAreas, setAreasData] = useState([]); 
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Fetch al backend
 useEffect(() => {
    api.get("/catalogos/area-niveles")
      .then(res => {
        const data = res.data?.data || [];       
        setAreasData(data);
      })
      .catch(err => console.error("Error cargando áreas:", err));
  }, []);

  
  useEffect(() => {
    api.get("/catalogos/fases")
      .then(res => {
        const fasesData = (res.data?.data || []).map(f => ({ id: f.id, nombre: f.nombre }));
        setFases(fasesData);
      })
      .catch(err => console.error("Error cargando fases:", err));
  }, []);
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
  const areasDisponibles = useMemo(
    () => ["Todas las áreas", ...Object.keys(LEVELS_BY_AREA)],
    [LEVELS_BY_AREA]
  );
  const handleSetArea = (a) => {
    setArea(a);
    setNivel("Todos los niveles");
  };


   async function fetchData() {
      if (!dataAreas.length) return; // esperar a que se carguen las áreas
      setLoading(true);
      try {
        console.log("area", area, "nivel", nivel);
        const selectedArea = dataAreas.find((a) => a.nombre === area);
        const selectedNivel = selectedArea?.niveles.find((n) => n.nombre_nivel === nivel);        
        const orden = fase.nombre =="final" ? "puntaje_total" : "nombre";
        const direccion = fase.nombre =="final" ? "desc" : "asc";
         const params = {  
          esPublicado:true,  
          ordenar_por:orden,
          direccion:direccion,
          busqueda:query,          
          id_fase:fase.id,
          id_area: selectedArea?.id || null,
          id_nivel: selectedNivel?.id || null,          
          page: page,
        };
        console.log("payload",params);
        const res = await EvaluacionesRepository.filtrarResultados(params);
        console.log(res);
        if (res?.data) {
          const adaptedData = res.data.map((item) => ({
            id: item.id_competidor,
            name: item.nombre,
            area: item.area,
            nivel: item.nivel,
            score: item.puntaje || null,
            status: item.estado_final,
            rank: item.puesto,
            award: item.premio || null, 
            certificado:item.estado_certificado        
          }));
             
          setData(adaptedData );
          setLastPage(res.meta?.last_page || 1);
        }else{
          setData([]);
        }
      } catch (err) {
        console.error("Error al obtener evaluaciones:", err);
      } finally {
        setLoading(false);
      }
    }
  // ---------------- FETCH EVALUACIONES ----------------
  useEffect(() => {   
    fetchData();
  }, [fase, area, nivel,  page,query, dataAreas]);
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500); 

    return () => clearTimeout(delay);
  }, [query]);
  
  return {  
    dataAreas,
    data,               
    lastPage,     
    loading,
    setters:{setArea: handleSetArea, setNivel,setFase,setPage,setQuery},
    filtros:{area,nivel,fase,page,query},
    opciones:{areasDisponibles,nivelesDisponibles,fases},   
  };
}
