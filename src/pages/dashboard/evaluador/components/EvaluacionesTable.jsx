import { useEffect, useState } from "react";
import FilaEvaluacion from "./FilaEvaluacion.jsx";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository.js";
import FiltroEvaluaciones from "./FiltroEvaluaciones.jsx";

// Clave para almacenamiento local
const KEY = "evaluaciones_evaluador_v1";

// 🔹 Utilidades para almacenamiento local
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

export default function EvaluacionesTable({ opcion_tabla, esClasificados }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null); // Para paginación
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [inputBusqueda, setInputBusqueda] = useState("");

  // 🔹 Cargar evaluaciones desde API
  const fetchEvaluaciones = async (
    page = 1,
    busqueda = "",
    estado_clasificado = opcion_tabla
  ) => {
    setLoading(true);
    try {
      const res = await EvaluacionesRepository.getEvaluaciones({
        page,
        perPage: 10,
        busqueda,
        estado_clasificado,
      });
      setRows(res.data);
      setMeta(res.meta);
      setPage(res.meta.current_page);
    } catch (err) {
      console.error("Error al cargar evaluaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluaciones(1, filtro, opcion_tabla);
  }, [filtro, opcion_tabla]);

  // 🔹 Guardar localmente y sincronizar con backend

  const handleSaved = async (fila) => {
    try {
      // Actualiza en memoria local
      setRows((prev) =>
        prev.map((r) =>
          r.id_evaluacion === fila.id_evaluacion ? { ...r, ...fila } : r
        )
      );
      console.log(fila);
      // Actualiza localStorage
      const map = loadLocal();
      map[fila.id_evaluacion] = { ...map[fila.id_evaluacion], ...fila };
      saveLocal(map);

      // Enviar actualización al backend
      await EvaluacionesRepository.updateEvaluacion(fila.id, {
        nota: fila.nota,
        descripcion: fila.descripcion,
        conducta: fila.conducta,
      });

      console.log(
        `✅ Evaluación ${fila.id_evaluacion} actualizada correctamente.`
      );
    } catch (error) {
      console.error(
        `❌ Error al actualizar evaluación ${fila.id_evaluacion}:`,
        error
      );
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => setFiltro(inputBusqueda), 500); // espera 500ms
    return () => clearTimeout(timeout);
  }, [inputBusqueda]);

  return (
    <div className="w-full py-5">
      <div className="mb-4 px-4">
        <FiltroEvaluaciones
          value={inputBusqueda}
          onChange={(v) => setInputBusqueda(v)}
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="text-left px-4 py-3">Competidor/Equipo</th>
            <th className="text-left px-4 py-3">Área</th>
            <th className="text-left px-4 py-3">Nivel</th>
            <th className="text-left px-4 py-3">Nota académica</th>
            <th className="text-left px-4 py-3">Conducta</th>
            <th className="text-left px-4 py-3">Descripción</th>
            <th className="text-left px-4 py-3">Estado</th>
            {!esClasificados && <th className="px-4 py-3 text-left">Acción</th>}
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-gray-500 text-center" colSpan={7}>
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
              />
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-gray-500 text-center" colSpan={7}>
                Sin registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Paginación */}
      {/* Paginación */}
      {meta && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={!meta.prev_page_url}
            onClick={() => fetchEvaluaciones(page - 1, filtro)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {meta.current_page} de {meta.last_page}
          </span>
          <button
            disabled={!meta.next_page_url}
            onClick={() => fetchEvaluaciones(page + 1, filtro)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
