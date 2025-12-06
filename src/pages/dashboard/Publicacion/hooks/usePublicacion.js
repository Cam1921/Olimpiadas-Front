// src/pages/dashboard/publicacion/hooks/usePublicacion.js
import { useEffect, useState } from "react";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository"; 
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import { IoGitMerge } from "react-icons/io5";

export function usePublicacion({ fase, area, nivel, tipo, page = 1, perPage = 10 ,query, sort}) {
  // ---------------- ESTADOS ----------------
  const [data, setData] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- TOAST ----------------
  const generarListas = () => setToast({ type: "success", message: "Listas generadas (mock)." });
  const publicarResultados = () => setToast({ type: "info" });
  const limpiarToast = () => setToast(null);

  // ---------------- FETCH ÁREAS ----------------
  useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await getAreasConNiveles();
        if (res) setAllAreas(res);
      } catch (err) {
        console.error("Error al cargar áreas:", err);
      }
    }
    fetchAreas();
  }, []);
 
   async function fetchData() {
      if (!allAreas.length) return; // esperar a que se carguen las áreas
      setLoading(true);
      try {
        console.log("area", area, "nivel", nivel);
        const selectedArea = allAreas.find((a) => a.nombre === area);
        const selectedNivel = selectedArea?.niveles.find((n) => n.nombre_nivel === nivel);
        
        const params = {
          ordenar_por:sort.by,
          direccion:sort.dir,
          busqueda:query,
          estado_clasificado: tipo,
          id_fase:fase.id,
          id_area: selectedArea?.id || null,
          id_nivel: selectedNivel?.id || null,
          per_page: perPage,
          page: page,
        };
        console.log("payload",params);
        const res = await EvaluacionesRepository.filtrarEvaluaciones(params);
        console.log(res);
        if (res?.data) {
          const adaptedData = res.data.map((item) => ({
            id: item.id_competidor,
            nombre: item.nombre,
            area: item.area,
            nivel: item.nivel,
            puntaje: item.puntaje || null,
            estado: item.estado_final,
            puesto: item.puesto,
            premio: item.premio || null
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
  }, [fase, area, nivel, tipo, page, perPage, allAreas,sort]);
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
    publicarResultados,
    limpiarToast,
  };
}
