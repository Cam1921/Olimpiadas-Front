import { useEffect, useMemo, useState, useCallback } from "react";
import FilaEvaluacion from "./FilaEvaluacion.jsx";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository.js";

const KEY = "evaluaciones_evaluador_v1";
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveLocal(mapById) {
  try { localStorage.setItem(KEY, JSON.stringify(mapById)); } catch {}
}

// helpers de filtro/orden (no alteran tu fetch)
function nombreDe(r) {
  return r?.nombre_completo || r?.competidor?.nombre_completo || r?.nombre || "";
}
function ciDe(r) {
  return r?.ci || r?.documento_identidad || r?.competidor?.ci || "";
}
function notaDe(r) {
  const raw = r?.nota_academica ?? r?.nota ?? r?.evaluacion?.nota ?? null;
  if (raw === null || raw === undefined || raw === "" || raw === "0-100") return null;
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
function estadoDe(r) {
  const v = (r?.estado_clasificacion || r?.estado || "").toString().toLowerCase();
  if (v.includes("des")) return "desclasificados";
  if (v.includes("no"))  return "no_clasificados";
  if (v.includes("clas"))return "clasificados";
  return "sin_estado";
}

export default function EvaluacionesTable({
  opcion_tabla,
  esClasificados,
  idAreaNivelFase,
  estadoNivel,

  // NUEVO: modo y filtro por estado (para la pestaña Clasificación)
  mode = "notas",                    // 'notas' | 'clasificacion'
  estadoFilter = "todos",            // 'todos'|'clasificados'|'no_clasificados'|'desclasificados'
  // NUEVO: permitir filtros externos
  query: extQuery,
  sort:  extSort,
  showToolbar = true,
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // estado interno SOLO si no nos pasan externos
  const [intQuery, setIntQuery] = useState("");
  const [intSort,  setIntSort]  = useState({ by: "nombre", dir: "asc" });
  const query = extQuery !== undefined ? extQuery : intQuery;
  const sort  = extSort  !== undefined ? extSort  : intSort;

  const toggleSort = useCallback((by) => {
    const setter = extSort !== undefined ? () => {} : setIntSort;
    setter((prev) =>
      prev.by === by ? { by, dir: prev.dir === "asc" ? "desc" : "asc" }
                     : { by, dir: by === "nota" ? "desc" : "asc" }
    );
  }, [extSort]);

  const fetchEvaluaciones = async (pageParam = 1) => {
    setLoading(true);
    try {
      const res = await EvaluacionesRepository.getEvaluaciones(
        { page: pageParam, perPage: 10, estado_clasificado: opcion_tabla || "" },
        idAreaNivelFase
      );
      setRows(res.data);
      setMeta(res.meta);
      setPage(res.meta.current_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluaciones(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opcion_tabla, idAreaNivelFase]);

  const handleSaved = async (fila) => {
    setRows((prev) => prev.map((r) => r.id_evaluacion === fila.id_evaluacion ? { ...r, ...fila } : r));
    const map = loadLocal();
    map[fila.id_evaluacion] = { ...map[fila.id_evaluacion], ...fila };
    saveLocal(map);
    await EvaluacionesRepository.updateEvaluacion(fila.id_evaluacion, {
      nota: fila.nota,
      descripcion: fila.descripcion,
      conducta: fila.conducta,
    });
  };

  // ========= FILTRO + ORDEN (sobre datos ya cargados del back) =========
  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const nom = nombreDe(r).toLowerCase();
      const ci  = String(ciDe(r)).toLowerCase();
      return nom.includes(q) || ci.includes(q);
    });
  }, [rows, query]);

  const porEstado = useMemo(() => {
    if (mode !== "clasificacion" || estadoFilter === "todos") return filtradas;
    return filtradas.filter((r) => estadoDe(r) === estadoFilter);
  }, [filtradas, mode, estadoFilter]);

  const visibles = useMemo(() => {
    const arr = [...porEstado].map((x, i) => ({ x, i })); // sort estable
    arr.sort((A, B) => {
      let cmp;
      if (sort.by === "nota") {
        const a = notaDe(A.x), b = notaDe(B.x);
        if (a === null && b === null) cmp = 0;
        else if (a === null) cmp = sort.dir === "asc" ? -1 : 1;
        else if (b === null) cmp = sort.dir === "asc" ?  1 : -1;
        else cmp = a - b;
        if (sort.dir === "desc") cmp = -cmp;
      } else {
        const a = nombreDe(A.x).toLocaleLowerCase();
        const b = nombreDe(B.x).toLocaleLowerCase();
        cmp = a.localeCompare(b, "es", { sensitivity: "base" });
        if (sort.dir === "desc") cmp = -cmp;
      }
      return cmp !== 0 ? cmp : A.i - B.i;
    });
    return arr.map((o) => o.x);
  }, [porEstado, sort]);

  const showAccion =
    mode === "notas" &&
    !esClasificados &&
    !["confirmado", "Concluido"].includes(estadoNivel);

  const colSpan = showAccion ? 8 : 7; // ajusta colspan si ocultas Acción

  return (
    <div className="w-full overflow-x-auto">
      {/* Barra de búsqueda + orden (encima de la tabla) */}
      

      {/* Tabla */}
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-500 bg-gray-50">
          <tr className="bg-gray-50 text-gray-700">
            <th className="px-4 py-3">Competidor/Equipo</th>
            <th className="px-4 py-3 hidden sm:table-cell">Área</th>
            <th className="px-4 py-3 hidden sm:table-cell">Nivel</th>
            <th className="px-4 py-3 ">Nota académica</th>
            <th className="px-4 py-3">Conducta</th>
            <th className="px-4 py-3 hidden sm:table-cell">Descripción</th>
            <th className="px-4 py-3">Estado</th>
            {showAccion && <th className="px-4 py-3">Acción</th>}
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-6 text-center text-gray-500">
                Cargando evaluaciones...
              </td>
            </tr>
          ) : visibles.length ? (
            visibles.map((item) => (
              <FilaEvaluacion
                key={item.id_evaluacion}
                item={item}
                onSaved={handleSaved}
                esClasificados={esClasificados}
                estadoNivel={estadoNivel}
                readOnly={mode === "clasificacion"}   // ← AQUÍ se aplica solo lectura
              />
            ))
          ) : (
            <tr>
              <td colSpan={colSpan} className="px-4 py-6 text-center text-gray-500">
                Sin registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación (igual que la tuya) */}
      {meta && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 py-3 mt-4">
          <div className="flex gap-2 justify-center items-center">
            <button
              disabled={!meta.prev_page_url}
              onClick={() => fetchEvaluaciones(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-600 mt-2 sm:mt-0">
              Página {meta.current_page} de {meta.last_page}
            </span>
            <button
              disabled={!meta.next_page_url}
              onClick={() => fetchEvaluaciones(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Controles de Clasificación (chips) puedes ponerlos fuera si prefieres
         y pasar 'estadoFilter' desde EvaluadorHome.jsx */}
      {mode === "clasificacion" && (
        <div className="mt-2 hidden">
          {/* placeholder si decides mover chips aquí */}
          {estadoFilter}
        </div>
      )}
    </div>
  );
}
