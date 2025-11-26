import React, { use, useEffect, useMemo, useState } from "react";
import { Eye, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import { asignacionService } from "@/services/asignacionService";
import AsignarEvaluadores from "./AsignarEvaluadores";

export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const [allAreas, setAllAreas] = useState([]);
  const [nivel, setNivel] = useState([]);
  const [showAreas, setShowAreas] = useState(false);
  const [showNiveles, setShowNiveles] = useState(false);

  async function fetchAreas() {
    try {
      const areas = await getAreasConNiveles();
      setAllAreas(areas);
      console.log("Áreas cargadas:", areas);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  }

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAreaChange = (id) => {
    setAreaId(id); // guarda el área seleccionada

    const areaSeleccionada = allAreas.find((a) => a.id === Number(id));

    if (areaSeleccionada) {
      setNivel(areaSeleccionada.niveles); // carga niveles del área seleccionada
    } else {
      setNivel([]);
    }

    setNivelId(""); // limpiar nivel al cambiar de área
  };

  const areas = useMemo(
    () => [
      { id: "", nombre: "Selecciona un área…" },
      { id: "matematica", nombre: "Matemática" },
      { id: "fisica", nombre: "Física" },
      { id: "informatica", nombre: "Informática" },
    ],
    []
  );
  const niveles = useMemo(
    () => [
      { id: "", nombre: "Selecciona un nivel…" },
      { id: "primaria", nombre: "Primaria" },
      { id: "secundaria", nombre: "Secundaria" },
      { id: "olimpiada", nombre: "Olimpíada" },
    ],
    []
  );

  // Mock data
  const [evaluadores, setEvaludores] = useState([]);
  /*  const [evaluadores] = useState([
    {
      id: 1,
      nombre: "Carmen Vargas",
      area: "Matemática",
      nivel: "Primaria",
      cargaActual: 2,
    },
    {
      id: 2,
      nombre: "Roberto Silva",
      area: "Matemática",
      nivel: "Primaria",
      cargaActual: 3,
    },
    {
      id: 3,
      nombre: "Patricia Méndez",
      area: "Matemática",
      nivel: "Primaria",
      cargaActual: 5,
    },
    {
      id: 4,
      nombre: "Luis Morales",
      area: "Matemática",
      nivel: "Primaria",
      cargaActual: 6,
    },
    {
      id: 5,
      nombre: "Jorge Castro",
      area: "Matemática",
      nivel: "Primaria",
      cargaActual: 8,
    },
  ]); */

  // Estado UI
  const [areaId, setAreaId] = useState("");
  const [nivelId, setNivelId] = useState("");
  const [limiteEvaluadoresActivos, setLimiteEvaluadoresActivos] = useState(3); // A: controla cuántos evaluadores quedan activos
  const [limitePorEvaluador, setLimitePorEvaluador] = useState(10); // B: máximo de competidores por evaluador
  const [cantidadEvaluadores, setCantidadEvaluadores] = useState(1);
  const [configLimite, setConfigLimite] = useState(0);
  const [totalEvaluadores, setTotalEvaluadores] = useState(0);
  const [showConfig, setShowConfig] = useState(false);

  async function fetchEvaluadores() {
    try {
      const params = {
        id_area: areaId,
        id_nivel: nivelId,
      };
      const res = await asignacionService.filtrarEvaluadores(params);
      const data = res.data.map((e) => ({
        id: e.id,
        nombre: e.nombre,
        area: e.area,
        nivel: e.nivel,
        estado: e.estado,
        cargaActual: e.carga_actual,
        espacios_disponibles: e.espacios_disponibles,
      }));

      setEvaludores(data);
      console.log(res);
      setLimitePorEvaluador(res.meta.limite_por_evaluador);
      setCantidadEvaluadores(res.meta.limite_cantidad_evaluadores);
      setTotalEvaluadores(res.meta.total_evaluadores);
      console.log("Evaludores filtrados:", data);
      console.log("Evaluadores:", res.data);
      console.log("limiete", res.meta.limite_por_evaluador);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  }
  useEffect(() => {
    fetchEvaluadores();
  }, [areaId, nivelId]);

  const handleReasignar = async () => {
    try {
      const data = {
        id_area: areaId,
        id_nivel: nivelId,
        limite_por_evaluador: configLimite,
        cantidad_evaluadores: cantidadEvaluadores,
      };
      const res = await asignacionService.asignarCompetidores(data);

      fetchEvaluadores();

      console.log("Asignacion:", res);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  };

  const evaluadoresFiltrados = useMemo(() => {
    return evaluadores.filter((e) => {
      const nombreArea =
        areas.find((a) => a.id === areaId)?.nombre?.toLowerCase() ?? "";
      const nombreNivel =
        niveles.find((n) => n.id === nivelId)?.nombre?.toLowerCase() ?? "";

      const okArea = !areaId || e.area?.toLowerCase().includes(nombreArea);
      const okNivel = !nivelId || e.nivel?.toLowerCase().includes(nombreNivel);

      return okArea && okNivel;
    });
  }, [evaluadores, areaId, nivelId, areas, niveles]);

  const evaluadoresConEstado = useMemo(() => {
    const activosHasta = Math.max(
      0,
      Math.min(limiteEvaluadoresActivos, evaluadoresFiltrados.length)
    );

    return evaluadoresFiltrados.map((e, idx) => ({
      ...e,
      enCupo: idx < activosHasta,
    }));
  }, [evaluadoresFiltrados, limiteEvaluadoresActivos]);

  const puedePrevisualizar =
    !!areaId && !!nivelId && limiteEvaluadoresActivos > 0;

  const onPreview = () => {
    navigate("/dashboard/asignacion-competidores/preview", {
      state: {
        areaId,
        nivelId,
        limiteEvaluadoresActivos,
        limitePorEvaluador,
      },
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-10 mt-10 md:mt-14">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Asignar Competidores
          </h1>
          <p className="text-sm text-slate-500">
            Selecciona área y nivel para gestionar la asignación de competidores
            a evaluadores
          </p>
        </div>
        <button
          onClick={() => {
            setShowConfig(true);
            setConfigLimite(limitePorEvaluador);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
          title="Configurar límite por evaluador (máximo de competidores por evaluador)"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Asignar competidores
        </button>
      </div>

      {/* Filtros + controles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">
          {/* Área */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Seleccionar Área
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                value={areaId}
                onChange={(e) => {
                  handleAreaChange(e.target.value);
                  setAreaId(e.target.value);
                }}
              >
                <option value="">Selecciona un área…</option>
                {allAreas.map((a) => (
                  <option key={a.id} value={a.id} disabled={a.id === ""}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
          </div>

          {/* Nivel */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Seleccionar Nivel
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                value={nivelId}
                onChange={(e) => setNivelId(e.target.value)}
              >
                <option value="">Selecciona un nivel…</option>
                {nivel.map((n) => (
                  <option key={n.id} value={n.id} disabled={n.id === ""}>
                    {n.nombre_nivel}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
          </div>

          {/* A: Límite de evaluadores activos */}
          {/*   <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Límite de evaluadores activos
            </label>
            <input
              type="number"
              min={0}
              max={evaluadoresFiltrados.length}
              value={limiteEvaluadoresActivos}
              onChange={(e) => {
                const n = Number(e.target.value);
                const bounded = Math.max(
                  0,
                  Math.min(evaluadores.length, isNaN(n) ? 0 : n)
                );
                setLimiteEvaluadoresActivos(bounded);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
            />
          </div>
 */}
          {/* Previsualizar */}
        </div>
      </div>

      {/* Lista de evaluadores */}
      <h2 className="text-sm font-semibold text-slate-600 mb-2">
        Evaluadores disponibles
      </h2>

      {evaluadoresConEstado.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          No hay evaluadores para ese filtro.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evaluadoresConEstado.map((e) => {
            const fueraDeLimite = !e.enCupo; // inactivo si excede el límite de evaluadores activos
            const progreso = Math.min(
              100,
              Math.round((e.cargaActual / limitePorEvaluador) * 100)
            );

            return (
              <div
                key={e.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{e.nombre}</p>
                    <p className="text-sm text-slate-500">
                      {e.area} - {e.nivel}
                    </p>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      e.estado === "Activo"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {e.estado === "Activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="mt-3 text-sm">
                  <p className="text-slate-600 flex items-center gap-2">
                    Carga actual
                    <span className="ml-auto font-semibold">
                      {e.cargaActual} / {limitePorEvaluador}
                    </span>
                  </p>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>

                  {fueraDeLimite && (
                    <p className="mt-2 text-xs font-medium text-rose-600">
                      Fuera del límite (no participa)
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    {Math.max(0, limitePorEvaluador - e.cargaActual)} espacios
                    disponibles
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

        <AsignarEvaluadores /> 

      {/* Modal: B – Límite por evaluador */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">
              Configurar Asingnacion de evaluadores
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Define el <strong>máximo de competidores</strong> por evaluador.
              Esto es independiente del campo{" "}
              <em>“Límite de evaluadores activos”</em>.
            </p>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Cantidad evaluadores
              </label>
              <input
                type="number"
                min={1}
                max={totalEvaluadores}
                disabled={!cantidadEvaluadores}
                value={cantidadEvaluadores}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  // Controla que nunca supere el total de evaluadores
                  if (value > totalEvaluadores) {
                    setCantidadEvaluadores(totalEvaluadores);
                  } else {
                    setCantidadEvaluadores(Math.max(1, value));
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Máximo por evaluador
              </label>
              <input
                type="number"
                min={1}
                disabled={!configLimite}
                value={configLimite}
                onChange={(e) =>
                  setConfigLimite(Math.max(1, Number(e.target.value)))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowConfig(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleReasignar();
                  setShowConfig(false);
                }}
                disabled={!cantidadEvaluadores || !configLimite}
                className={`rounded-xl px-4 py-2 text-sm font-medium 
    ${
      !cantidadEvaluadores || !configLimite
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-sky-600 hover:bg-sky-700 text-white"
    }`}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
