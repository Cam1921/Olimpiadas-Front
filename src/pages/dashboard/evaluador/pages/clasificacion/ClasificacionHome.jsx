// src/pages/dashboard/evaluador/pages/clasificacion/ClasificacionHome.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/lib/api";
import EvaluacionesTableClasificacion from "@/pages/dashboard/evaluador/components/EvaluacionesTableClasificacion.jsx";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository.js";

export default function ClasificacionHome() {
  // Filtros UI
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ by: "nombre", dir: "asc" }); // 'nombre' | 'nota'
  const [estado, setEstado] = useState("todos"); // 'todos'|'clasificados'|'no_clasificados'|'descalificados'

  // Acciones (exportar / concluir)
  const [exporting, setExporting] = useState(false);
  const [concluding, setConcluding] = useState(false);

  // Contexto (área/nivel/fase)
  const { state } = useLocation();
  const [ctxLoading, setCtxLoading] = useState(true);
  const [ctxError, setCtxError] = useState("");
  const [idAreaNivelFase, setIdAreaNivelFase] = useState(null);
  const [estadoNivel, setEstadoNivel] = useState(null); // 'en_evaluacion'|'concluido'|'confirmado'|'publicado'
  const [headerTitle, setHeaderTitle] = useState("");

  // 1) Usa lo que venga por state o lo último guardado; si no hay, autodetecta el primer nivel asignado
  useEffect(() => {
    const sId    = state?.idAreaNivelFase ?? sessionStorage.getItem("idAreaNivelFase");
    const sEst   = state?.estadoNivel ?? sessionStorage.getItem("estadoNivel");
    const sTitle = state?.headerTitle ?? sessionStorage.getItem("headerTitle");

    if (sId) {
      setIdAreaNivelFase(sId);
      setEstadoNivel(sEst || "en_evaluacion");
      setHeaderTitle(sTitle || "");
      setCtxLoading(false);
      return;
    }

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
        // toma el primero (ajústalo si requieres otro criterio)
        const first = list[0];
        const id    = first.id_area_nivel_fase;
        const title = `${first.area} • ${first.nivel} • ${first.fase}`;
        const est   = (first.estado ?? "en_evaluacion").toLowerCase();

        setIdAreaNivelFase(id);
        setEstadoNivel(est);
        setHeaderTitle(title);

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

  // Map chip → parámetro backend
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

  // ======== Exportar listas (Excel) ========
  const handleExport = async () => {
    if (!idAreaNivelFase || exporting) return;
    setExporting(true);
    try {
      // Llama al repo (GET blob). Ajusta la URL en repository.js si tu backend usa otra ruta/params
      const blob = await EvaluacionesRepository.exportClasificacionExcel(
        idAreaNivelFase,
        { estado_clasificado: opcionTabla || undefined, q: query || undefined, sort_by: sort.by, sort_dir: sort.dir }
      );

      const nombreEstado = estado === "todos" ? "todos" : estado;
      const nombreBase   = (headerTitle || "clasificacion").replace(/[^\w\-]+/g, "_");
      const filename     = `${nombreBase}_${nombreEstado}.xlsx`;

      const url = URL.createObjectURL(new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("No se pudo exportar las listas.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  // ======== Concluir calificación (pasar a "concluido") ========
  const puedeConcluir = useMemo(() => {
    // Deshabilita si ya está concluido/confirmado/publicado
    const est = (estadoNivel || "").toLowerCase();
    return est !== "concluido" && est !== "confirmado" && est !== "publicado";
  }, [estadoNivel]);

  const handleConcluir = async () => {
    if (!idAreaNivelFase || concluding || !puedeConcluir) return;
    if (!confirm("¿Marcar como CONCLUIDA la calificación de este Área/Nivel?")) return;

    setConcluding(true);
    try {
      // Llama al repo (POST). Ajusta la URL en repository.js si tu backend usa otra ruta.
      await EvaluacionesRepository.concluirCalificacion(idAreaNivelFase);
      setEstadoNivel("concluido");
      sessionStorage.setItem("estadoNivel", "concluido");
    } catch (e) {
      alert("No se pudo concluir la calificación.");
      console.error(e);
    } finally {
      setConcluding(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <header className="space-y-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {headerTitle ? `Clasificación - ${headerTitle}` : "Clasificación"}
            </h1>
            <p className="text-gray-500">
              Visualiza las listas de competidores clasificados, no clasificados y descalificados.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={!idAreaNivelFase || exporting || ctxLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 disabled:opacity-60"
              title="Descargar Excel de la vista actual"
            >
              <span>⬇</span> {exporting ? "Exportando…" : "Exportar listas"}
            </button>

            <button
              onClick={handleConcluir}
              disabled={!idAreaNivelFase || !puedeConcluir || concluding || ctxLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 disabled:opacity-60"
              title="Marcar calificación como Concluida"
            >
              {concluding ? "Concluyendo…" : "Concluir calificación"}
            </button>
          </div>
        </div>
      </header>

      {/* Chips + buscador + ordenar */}
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
            onClick={() => setSort((s) => (s.by === "nombre" ? { by: "nombre", dir: s.dir === "asc" ? "desc" : "asc" } : { by: "nombre", dir: "asc" }))}
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
            onClick={() => setSort((s) => (s.by === "nota" ? { by: "nota", dir: s.dir === "asc" ? "desc" : "asc" } : { by: "nota", dir: "desc" }))}
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

      {/* Estado del contexto o tabla */}
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
          />
        </section>
      )}
    </div>
  );
}
