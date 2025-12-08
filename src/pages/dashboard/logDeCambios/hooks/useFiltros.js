import { useState, useEffect } from "react";
import api from "@/lib/api";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository";

export default function useFiltros() {
  // filtros seleccionados
  const [filtroArea, setFiltroArea] = useState(null); // id
  const [filtroNivel, setFiltroNivel] = useState(null); // id
  const [filtroRol, setFiltroRol] = useState(null); // id
  const [filtroFase, setFiltroFase] = useState(null); // id
  const [filtroAccion, setFiltroAccion] = useState(null); // accion    
  
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);

  // opciones dinámicas
  const [areas, setAreas] = useState([]);
  const [nivelesPorArea, setNivelesPorArea] = useState({});
  const [niveles, setNiveles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [fases, setFases] = useState([]);
  const acciones = [    
    "update",
    "insert"
  ]     
  

  // datos filtrados
  const [data, setData] = useState([]);

  // informacion
  const [info, setInfo] = useState({});

  // cargar áreas y niveles
  useEffect(() => {
    api.get("/catalogos/area-niveles")
      .then(res => {
        const data = res.data?.data || [];
        const areaNames = data.map(a => ({ id: a.id, nombre: a.nombre }));
        const nivelesMap = {};
        data.forEach(a => {
          nivelesMap[a.id] = (a.niveles || []).map(n => ({ id: n.id, nombre: n.nombre_nivel }));
        });
        setAreas(areaNames);
        setNivelesPorArea(nivelesMap);
      })
      .catch(err => console.error("Error cargando áreas:", err));
  }, []);

  // cargar roles
  useEffect(() => {
    api.get("/catalogos/roles")
      .then(res => {
        const rolesData = (res.data?.data || []).map(r => ({ id: r.id, nombre: r.nombre }));
        setRoles(rolesData);
      })
      .catch(err => console.error("Error cargando roles:", err));
  }, []);

  // cargar fases
  useEffect(() => {
    api.get("/catalogos/fases")
      .then(res => {
        const fasesData = (res.data?.data || []).map(f => ({ id: f.id, nombre: f.nombre }));
        setFases(fasesData);
      })
      .catch(err => console.error("Error cargando fases:", err));
  }, []);

  // actualizar niveles cuando cambia área
  useEffect(() => {
    if (!filtroArea) {
      // juntar todos los niveles
      const todos = new Set();
      Object.values(nivelesPorArea).forEach(arr => arr.forEach(n => todos.add(JSON.stringify(n))));
      setNiveles(Array.from(todos).map(s => JSON.parse(s)));
    } else {
      setNiveles(nivelesPorArea[filtroArea] || []);
    }
    setFiltroNivel(null);
  }, [filtroArea, nivelesPorArea]);

  // cargar datos filtrados desde backend
useEffect(() => {
  const params = {
    accion: filtroAccion,
    id_area: filtroArea,
    id_nivel: filtroNivel,
    id_rol: filtroRol,
    id_fase: filtroFase,
    per_page: 10,
    page: page,
    fecha: selectedDate ? selectedDate.toISOString().split("T")[0] : undefined
  };

  EvaluacionesRepository.filtrosLogs(params)
    .then(res => {
      const mappedData = (res.data || []).map((item, index) => ({
        id: item.id, // o usa item.id si viene del backend
        fecha: item.fecha_hora?.split(" ")[0] || "",
        hora: item.fecha_hora?.split(" ")[1] || "",
        competidor: item.competidor || "",
        area: item.area || "",
        nivel: item.nivel || "",
        fase: item.fase || "",
         notaAntes: item.nota_antes != null ? Number(item.nota_antes).toFixed(2) : null,
  notaDespues: item.nota_despues != null ? Number(item.nota_despues).toFixed(2) : null,
        usuario: item.usuario || "",
        rol: item.rol || "",
        tipoAccion: item.accion || item.tipo_cambio || "",
        motivo: item.motivo || ""
      }));
      console.log(res.meta);
      setLastPage(res.meta.last_page);
      setInfo(res.meta);
      setData(mappedData);
    })
    .catch(err => {
      console.error("Error cargando logs:", err);
      setData([]);
    });
}, [filtroArea, filtroNivel, filtroRol, filtroFase, filtroAccion,selectedDate,page]);

  const limpiarFiltros = () => {
    setFiltroArea(null);
    setFiltroNivel(null);
    setFiltroRol(null);
    setFiltroFase(null);
    setSelectedDate(null);
    setFiltroAccion(null);
  };

  return {
    filtros: { filtroArea, filtroNivel, filtroRol, filtroFase ,filtroAccion , selectedDate, page },
    setters: { setFiltroArea, setFiltroNivel, setFiltroRol, setFiltroFase,setFiltroAccion , setSelectedDate,setPage },
    opciones: { areas, niveles, roles, fases ,acciones},
    lastPage,
    info,
    data,
    limpiarFiltros
  };
}
