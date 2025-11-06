// src/pages/dashboard/evaluador/components/EvaluacionesTable.jsx
import { useEffect, useState } from "react";
import FilaEvaluacion from "./FilaEvaluacion.jsx";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository.js";

const KEY = "evaluaciones_evaluador_v1";
function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function saveLocal(mapById) {
  try {
    localStorage.setItem(KEY, JSON.stringify(mapById));
  } catch {}
}

export default function EvaluacionesTable({
  opcion_tabla,
  esClasificados,
  idAreaNivelFase,
  estadoNivel,
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEvaluaciones = async (page = 1) => {
    setLoading(true);
    try {
      // Aquí enviamos los params como primer argumento, y el idAreaNivelFase como segundo
      const res = await EvaluacionesRepository.getEvaluaciones(
        { page, perPage: 10, estado_clasificado: opcion_tabla },
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
    console.log("estado", estadoNivel);
    fetchEvaluaciones(1);
  }, [opcion_tabla]);

  const handleSaved = async (fila) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id_evaluacion === fila.id_evaluacion ? { ...r, ...fila } : r
      )
    );
    const map = loadLocal();
    map[fila.id_evaluacion] = { ...map[fila.id_evaluacion], ...fila };
    saveLocal(map);
    await EvaluacionesRepository.updateEvaluacion(fila.id_evaluacion, {
      nota: fila.nota,
      descripcion: fila.descripcion,
      conducta: fila.conducta,
    });
  };

  return (
    <div className="w-full overflow-x-auto">
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
            {!esClasificados &&
              !["confirmado", "Concluido"].includes(estadoNivel) && (
                <th className="px-4 py-3">Acción</th>
              )}
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Cargando evaluaciones...
              </td>
            </tr>
          ) : rows.length ? (
            rows.map((item) => (
              <FilaEvaluacion
                key={item.id_evaluacion}
                item={item}
                onSaved={handleSaved}
                esClasificados={esClasificados}
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

      {/* Paginación */}
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
