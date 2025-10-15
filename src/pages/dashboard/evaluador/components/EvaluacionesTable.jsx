import { useEffect, useState } from "react";
import FilaEvaluacion from "./FilaEvaluacion.jsx";

const seed = [
  {
    id: 1,
    codigo: "ID:COMP-001",
    nombre: "Maria Gonzales Perez",
    area: "Matemáticas",
    nivel: "Primaria",
    nota: "",
    descripcion: "",
    conducta: { integridad: false, puntualidad: false, respeto: false },
  },
  {
    id: 2,
    codigo: "ID:COMP-002",
    nombre: "Fernando Siles",
    area: "Matemáticas",
    nivel: "Primaria",
    nota: "",
    descripcion: "",
    conducta: { integridad: false, puntualidad: false, respeto: false },
  },
];

const KEY = "evaluaciones_evaluador_v1";
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveLocal(mapById) {
  try { localStorage.setItem(KEY, JSON.stringify(mapById)); } catch {}
}

export default function EvaluacionesTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const persisted = loadLocal();
    const merged = seed.map((r) => (persisted[r.id] ? { ...r, ...persisted[r.id] } : r));
    setRows(merged);
  }, []);

  const handleSaved = (fila) => {
    setRows((prev) => prev.map((r) => (r.id === fila.id ? { ...r, ...fila } : r)));
    const map = loadLocal();
    map[fila.id] = { ...map[fila.id], ...fila };
    saveLocal(map);
  };

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="text-left px-4 py-3">Competidor/Equipo</th>
            <th className="text-left px-4 py-3">Área</th>
            <th className="text-left px-4 py-3">Nivel</th>
            <th className="text-left px-4 py-3">Nota académica</th>
            <th className="text-left px-4 py-3">Conducta</th>
            <th className="text-left px-4 py-3">Descripción</th>
            <th className="px-4 py-3 text-left">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.map((item) => (
            <FilaEvaluacion key={item.id} item={item} onSaved={handleSaved} />
          ))}
          {!rows.length && (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={7}>Sin registros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
