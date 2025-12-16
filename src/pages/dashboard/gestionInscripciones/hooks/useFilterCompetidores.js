import api from "@/lib/api";
import { estadoService } from "@/services/estadoService";
import { useCallback, useEffect, useMemo, useState } from "react";


export function useFilterCompetidores() {   
const [data, setData] = useState([]);
const [importedData, setImportedData] = useState([]);
 const [dataAreas, setAreasData] = useState([]); 
 const [area, setArea] = useState("Todas las áreas");
 const [nivel, setNivel] = useState("Todos los niveles");
 const [query, setQuery] = useState("");
 const [debouncedQuery, setDebouncedQuery] = useState(query);
 const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(1);
 const [lastPage, setLastPage] = useState(1);
 const [actividad, setActividad]= useState(null);
 useEffect(() => {
    async function fetchEstados() {
     try {
       const res = await estadoService.actualizarEstados();
       console.log("Estados actualizados cargadas:", res);
     } catch (err) {
       console.error("Error al cargar áreas:", err);
     }
   }
   fetchEstados(); 
 },[]);  

  useEffect(() => {
    api.get("/catalogos/area-niveles")
      .then(res => {
        const data = res.data?.data || [];       
        setAreasData(data);
      })
      .catch(err => console.error("Error cargando áreas:", err));
  }, []);
  useEffect(() => {
    api.get("/actividades/verificar/inscripcion/importacion")
      .then(res => {
        const data = res.data|| null;  
           
        console.log(data);
        setActividad(data);
      })
      .catch(err => console.error("Error cargando áreas:", err));
  }, []);
   
  const exportExcel = async () => {
    try {
        const selectedArea = dataAreas.find((a) => a.nombre === area);
        const selectedNivel = selectedArea?.niveles.find((n) => n.nombre_nivel === nivel); 
        const params = {
         gestion:2025,       
         area_id: selectedArea?.id || null,
         nivel_id: selectedNivel?.id || null,
         busqueda: query || null,
        };  

      // Hacer request al backend para obtener el archivo
      const response = await api.get("/competidores/export", {
        params,
        responseType: "blob",
      });

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo
      link.setAttribute(
        "download",
        `competidores_${new Date().getFullYear()}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
    }
   };    
 const fetchCompetidores =useCallback( async () => {
      setLoading(true);     
      try {
      if(!dataAreas.length) return; 
      if(importedData.length > 0) {
        const total = Math.ceil(importedData.length / 10);
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10; 
        setLastPage(total);        
        setData(importedData.slice(startIndex, endIndex));
      }else{
        const selectedArea = dataAreas.find((a) => a.nombre === area);
        const selectedNivel = selectedArea?.niveles.find((n) => n.nombre_nivel === nivel); 
        const params = {         
         gestion:2025, 
         page:page, 
         per_page: 10,
         area_id: selectedArea?.id || null,
         nivel_id: selectedNivel?.id || null,
         busqueda: debouncedQuery || "",
        };     
        const res = await api.get("/competidores", { params });
        console.log("esto son los compeptidores listados",res);
        const competidores = res.data.data || [];
        const pagination = res.data.meta?.pagination || {};
        setData(competidores);               
        setLastPage(pagination.last_page || 1);
      }
       
      } catch (error) {
        console.error("Error al obtener competidores", error);
        setData([]);        
      } finally {
        setLoading(false);
      }
    },[area, nivel, page, debouncedQuery, importedData,dataAreas]);
    useEffect(() => {   
      fetchCompetidores();
    }, [fetchCompetidores]);
    
    const LEVELS_BY_AREA = useMemo(() => {
    const map = {};
    dataAreas.forEach((a) => {
      map[a.nombre] = a.niveles.map((n) => n.nombre_nivel);
    });
    return map;
  }, [dataAreas]);
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
    
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
    setPage(1); // reset de página
  }, 500);

  return () => clearTimeout(timer);
}, [query]);
  return {  
    actividad,
    dataAreas,
    importedData,
    data,               
    lastPage,     
    loading,
    exportExcel,
    setters:{setArea: handleSetArea, setNivel,setPage,setQuery,setImportedData},
    filtros:{area,nivel,page,query},
    opciones:{areasDisponibles,nivelesDisponibles},   
  };

}