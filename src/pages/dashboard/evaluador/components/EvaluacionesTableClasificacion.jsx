// src/pages/dashboard/evaluador/components/EvaluacionesTableClasificacion.jsx
import { useEffect, useMemo, useState } from "react";
import FilaEvaluacion from "./FilaEvaluacion.jsx";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository.js";

function toNumberNota(raw) {
  if (raw === null || raw === undefined || raw === "" || raw === "0-100") return null;
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export default function EvaluacionesTableClasificacion({
  idAreaNivelFase,
  estadoNivel,              // por si quieres pintar algún detalle del estado del nivel
  estadoFilter = "todos",   // 'todos'|'clasificados'|'no_clasificados'|'descalificados'
  query = "",               // buscar por nombre o CI
  sort = { by: "nombre", dir: "asc" }, // {by:'nombre'|'nota', dir:'asc'|'desc'}
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const opcion_tabla = useMemo(
    () => (estadoFilter === "todos" ? "" : estadoFilter),
    [estadoFilter]
  );

  const fetchEvaluaciones = async (nextPage = 1) => {
    if (!idAreaNivelFase) return;
    setLoading(true);
    try {
      const res = await EvaluacionesRepository.getEvaluaciones(
        { page: nextPage, perPage: 10, estado_clasificado: opcion_tabla },
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

  // recarga cuando cambia chip de estado o el contexto (id)
  useEffect(() => {
    fetchEvaluaciones(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opcion_tabla, idAreaNivelFase]);

  // --- Filtros locales (buscador y ordenar) sobre lo que vino del back (por página) ---
  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const nom = String(r?.nombre || "").toLowerCase();
      const ci  = String(r?.ci || "").toLowerCase();
      return nom.includes(q) || ci.includes(q);
    });
  }, [rows, query]);

  const ordenadas = useMemo(() => {
    const arr = [...filtradas].map((x, i) => ({ x, i })); // sort estable
    if (sort.by === "nota") {
      arr.sort((A, B) => {
        const a = toNumberNota(A.x?.nota);
        const b = toNumberNota(B.x?.nota);
        if (a === null && b === null) return A.i - B.i;
        if (a === null) return sort.dir === "asc" ? -1 : 1;
        if (b === null) return sort.dir === "asc" ?  1 : -1;
        return sort.dir === "asc" ? a - b : b - a;
      });
    } else {
      arr.sort((A, B) => {
        const an = String(A.x?.nombre || "").toLocaleLowerCase();
        const bn = String(B.x?.nombre || "").toLocaleLowerCase();
        const c  = an.localeCompare(bn, "es", { sensitivity: "base" });
        return sort.dir === "desc" ? -c : c || A.i - B.i;
      });
    }
    return arr.map((o) => o.x);
  }, [filtradas, sort]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-500 bg-gray-50">
          <tr className="bg-gray-50 text-gray-700">
            <th className="px-4 py-3">Competidor/Equipo</th>
            <th className="px-4 py-3 hidden sm:table-cell">Área</th>
            <th className="px-4 py-3 hidden sm:table-cell">Nivel</th>
            <th className="px-4 py-3">Nota académica</th>
            <th className="px-4 py-3">Conducta</th>
            <th className="px-4 py-3 hidden sm:table-cell">Descripción</th>
            <th className="px-4 py-3">Estado</th>
            {/* 🚫 SIN columna Acción */}
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Cargando evaluaciones...
              </td>
            </tr>
          ) : ordenadas.length ? (
            ordenadas.map((item) => (
              <FilaEvaluacion
                key={item.id_evaluacion}
                item={item}
                // Solo lectura y sin acción:
                readOnly={true}
                esClasificados={true}
                estadoNivel={estadoNivel}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Sin registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación (igual que tu tabla original) */}
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
    </div>
  );
}
