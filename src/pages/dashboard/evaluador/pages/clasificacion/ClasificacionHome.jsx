// src/pages/dashboard/evaluador/pages/clasificacion/ClasificacionHome.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/lib/api";
import EvaluacionesTableClasificacion from "@/pages/dashboard/evaluador/components/EvaluacionesTableClasificacion.jsx";

export default function ClasificacionHome() {
  // Filtros UI
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ by: "nombre", dir: "asc" }); // 'nombre' | 'nota'
  const [estado, setEstado] = useState("todos"); // 'todos'|'clasificados'|'no_clasificados'|'descalificados'

  // Contexto (área/nivel/fase) que la tabla necesita
  const { state } = useLocation();
  const [ctxLoading, setCtxLoading] = useState(true);
  const [ctxError, setCtxError] = useState("");
  const [idAreaNivelFase, setIdAreaNivelFase] = useState(null);
  const [estadoNivel, setEstadoNivel] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("");

  // 1) Usa lo que venga por state o lo último guardado…
  useEffect(() => {
    const sId    = state?.idAreaNivelFase ?? sessionStorage.getItem("idAreaNivelFase");
    const sEst   = state?.estadoNivel ?? sessionStorage.getItem("estadoNivel");
    const sTitle = state?.headerTitle ?? sessionStorage.getItem("headerTitle");

    if (sId) {
      setIdAreaNivelFase(sId);
      setEstadoNivel(sEst || "");
      setHeaderTitle(sTitle || "");
      setCtxLoading(false);
      return;
    }

    // 2) …y si no hay nada, toma automáticamente el PRIMER nivel del evaluador
    (async () => {
      setCtxLoading(true);
      setCtxError("");
      try {
        const res = await api.get("/evaluador/niveles");
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];

        if (!list.length) {
          setCtxError("No tienes niveles asignados.");
          return;
        }

        // Puedes ajustar esta selección (por ahora tomamos el primero)
        const first = list[0];
        const id    = first.id_area_nivel_fase;
        const title = `${first.area} • ${first.nivel} • ${first.fase}`;
        const est   = first.estado ?? "";

        setIdAreaNivelFase(id);
        setEstadoNivel(est);
        setHeaderTitle(title);

        // Persiste para refrescos/volver directo
        sessionStorage.setItem("idAreaNivelFase", id);
        sessionStorage.setItem("estadoNivel", est);
        sessionStorage.setItem("headerTitle", title);
      } catch (e) {
        setCtxError("No se pudo cargar tu contexto de clasificación.");
      } finally {
        setCtxLoading(false);
      }
    })();
  }, [state]);

  // Chips estado → parámetro backend
  const opcionTabla = useMemo(() => (estado === "todos" ? "" : estado), [estado]);
  const opciones = [
    { label: "Todos", value: "todos" },
    { label: "Clasificados", value: "clasificados" },
    { label: "No clasificados", value: "no_clasificados" },
    { label: "Descalificados", value: "descalificados" },
  ];

  const active = (by) => sort.by === by;
  const arrow  = sort.dir === "asc" ? "▲" : "▼";
  const toggleSort = (by) => {
    const next =
      sort.by === by
        ? { by, dir: sort.dir === "asc" ? "desc" : "asc" }
        : { by, dir: by === "nota" ? "desc" : "asc" };
    setSort(next);
  };

  return (
    <div className="p-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {headerTitle ? `Clasificación - ${headerTitle}` : "Clasificación"}
        </h1>
        <p className="text-gray-500">
          Visualiza las listas de competidores clasificados, no clasificados y descalificados.
        </p>
      </header>

      {/* Barra superior: chips + buscador + ordenar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {opciones.map((op) => (
            <button
              key={op.value}
              onClick={() => setEstado(op.value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                estado === op.value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o CI…"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-sky-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          </div>

          <span className="text-sm text-gray-600">Ordenar por:</span>
          <button
            type="button"
            onClick={() => toggleSort("nombre")}
            aria-pressed={active("nombre")}
            className={[
              "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
              active("nombre")
                ? "border-sky-500 bg-sky-50 text-sky-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            <span>Nombre</span>
            {active("nombre") && <span>{arrow}</span>}
          </button>

          <button
            type="button"
            onClick={() => toggleSort("nota")}
            aria-pressed={active("nota")}
            className={[
              "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
              active("nota")
                ? "border-sky-500 bg-sky-50 text-sky-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            <span>Nota</span>
            {active("nota") && <span>{arrow}</span>}
          </button>
        </div>
      </div>

      {/* Estado del contexto */}
      {ctxLoading ? (
        <div className="px-4 py-10 text-center text-gray-500">Cargando…</div>
      ) : ctxError ? (
        <div className="px-4 py-10 text-center text-gray-500">{ctxError}</div>
      ) : (
        <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <EvaluacionesTableClasificacion
            idAreaNivelFase={idAreaNivelFase}
            estadoNivel={estadoNivel}
            estadoFilter={estado}
            query={query}
            sort={sort}
            // el repo trae los mismos datos que “Registrar notas” (nota, conducta, descripción, estado)
          />
        </section>
      )}
    </div>
  );
}
