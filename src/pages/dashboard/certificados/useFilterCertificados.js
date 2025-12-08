// src/pages/dashboard/publicacion/hooks/useFilters.js
import { useMemo, useState, useEffect } from "react";
import api from "@/lib/api";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository";

export function useFilterCertificados({tab}) {
  const [dataLogs, setDataLogs] = useState([]);
  const [data, setData] = useState([]);  
  const [page, setPage] = useState(1); 
  const [lastPage, setLastPage] = useState(1);
   const [pageL, setPageL] = useState(1); 
  const [lastPageL, setLastPageL] = useState(1);

  const [area, setArea] = useState("Todas las áreas");
  const [nivel, setNivel] = useState("Todos los niveles");
  const [dataAreas, setAreasData] = useState([]); // datos del backend
  const [loading, setLoading] = useState(true);


  const handleGenerar = (idInscrito) => {
    console.log(idInscrito);
    const payload = {
      id_inscripcion: idInscrito,      
    }
    EvaluacionesRepository.generarCertificados(payload)
    .then(res => {console.log("resputea",res); fetchLogs();
      fetchCertificados();
    })
    .catch(err => console.error("Error cargando logs:", err));
  }
  // Fetch al backend
 useEffect(() => {
    api.get("/catalogos/area-niveles")
      .then(res => {
        const data = res.data?.data || [];       
        setAreasData(data);
      })
      .catch(err => console.error("Error cargando áreas:", err));
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

  const handleSetArea = (a) => {
    setArea(a);
    setNivel("Todos los niveles");
  };

  const fetchLogs = () => {
  const id_area = dataAreas.find(a => a.nombre === area)?.id;
  const id_nivel = dataAreas.find(a => a.nombre === area)?.niveles.find(n => n.nombre_nivel === nivel)?.id;

  const params = {   
    id_area: id_area || null,
    id_nivel: id_nivel || null,        
  };

  EvaluacionesRepository.getLogsCertificados(params)
    .then(res => {

      const mappedData = (res.data || []).map((item, index) => {
        
        // ← AQUÍ SE SEPARA FECHA Y HORA
        const [fecha, hora] = item.fecha_hora.split(" "); // "2025-12-08", "02:51:55"

        return {
          fecha: fecha,                         
          hora: hora.slice(0, 5),       // 02:51
          usuario: item.usuario ?? "—",
          tipo: item.accion ?? "—",
          competidor: item.competidor ?? "—",
          area: item.area ?? "—",
          nivel: item.nivel ?? "—",
        };
      });

      setDataLogs(mappedData);
    })
    .catch(err => {
      console.error("Error cargando logs:", err);
      setDataLogs([]);
    });

};

useEffect(() => {
  fetchLogs();
}, [area, nivel]);


const fetchCertificados = () => {
   
  const id_area = dataAreas.find(a => a.nombre === area)?.id;
  const id_nivel = dataAreas.find(a => a.nombre === area)?.niveles.find(n => n.nombre_nivel === nivel)?.id;
  const filtroArea = id_area || null;
  const filtroNivel = id_nivel || null;   
  const params = {      
    estado: "certificados",
    id_area: filtroArea,
    id_nivel: filtroNivel, 
    page:page       
  };   
  EvaluacionesRepository.filtrarEvaluaciones(params)
    .then(res => {
      const mappedData = (res.data || []).map((item, index) => ({         
         id: item.id_ranking,
         id_inscrito: item.id_inscrito,
         nombre: item.nombre || item.nombre_completo,
         colegio: item.unidad_educativa,
         area: item.area,
         nivel: item.nivel,
         puntaje: item.nota || null,
         estado: item.estado_certificado,
         puesto: item.puesto,
         premio: item.premio || null
      }));
      console.log(res);     
      setData(mappedData);
      setLastPage(res.meta.last_page);
    })
    .catch(err => {
      console.error("Error cargando logs:", err);
      setData([]);
    });
}
useEffect(() => {
  
fetchCertificados();

}, [area,nivel,page]);
  const areasDisponibles = useMemo(
    () => ["Todas las áreas", ...Object.keys(LEVELS_BY_AREA)],
    [LEVELS_BY_AREA]
  );
  return {
    dataLogs,
    data,
    dataAreas,              
    lastPage,
    lastPageL,
    loading,
    setters:{setArea: handleSetArea, setNivel,setPage,setPageL},
    filtros:{area,nivel,page,pageL},
    opciones:{areasDisponibles,nivelesDisponibles},
    handleGenerar
  };
}
