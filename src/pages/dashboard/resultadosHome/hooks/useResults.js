// src/pages/dashboard/publicacion/hooks/usePublicacion.js
import { useEffect, useState } from "react";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository"; 
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import { IoGitMerge } from "react-icons/io5";
import { faseService } from "@/services/faseService";

export function useResult({dataAreas, fase, area, nivel,  page = 1, perPage = 10 ,query}) {
  // ---------------- ESTADOS ----------------
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  // ---------------- TOAST ----------------
  const generarListas = () => setToast({ type: "success", message: "Listas generadas (mock)." });

  const limpiarToast = () => setToast(null);
 
   async function fetchData() {
      if (!dataAreas.length) return; // esperar a que se carguen las áreas
      setLoading(true);
      try {
        console.log("area", area, "nivel", nivel);
        const selectedArea = dataAreas.find((a) => a.nombre === area);
        const selectedNivel = selectedArea?.niveles.find((n) => n.nombre_nivel === nivel);
        
        const params = {  
          esPublicado:true,  
          busqueda:query,          
          id_fase:fase.id,
          id_area: selectedArea?.id || null,
          id_nivel: selectedNivel?.id || null,
          per_page: perPage,
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
          }));
             
          setData(adaptedData);
          setTotalPages(res.meta?.last_page || 1);
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
  }, [fase, area, nivel,  page, perPage,dataAreas]);
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500); 

    return () => clearTimeout(delay);
  }, [query]);
  return {
    data,
    loading,
    totalPages,
    toast,
    generarListas,   
    limpiarToast,   
  };
}
