// EvaluadoresModal.jsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

function AsignacionesModal({
  isOpen = false,
  mode = "view",
  evaluadores = [],
  seleccionados = [],
  onClose = () => {},
  onSave = () => {},
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (mode === "assign") {
      setSelectedIds([]);
    }
  }, [mode, seleccionados]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === "view" ? "Evaluadores Asignados" : "Asignar Evaluadores"}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {evaluadores.length === 0 && (
            <p className="text-gray-500 text-sm">
              No hay evaluadores disponibles.
            </p>
          )}

          <ul className="space-y-2">
            {evaluadores.map((e) => (
              <li key={e.id} className="flex items-center">
                {mode === "assign" ? (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(e.id)}
                      onChange={() => toggleSelect(e.id)}
                      className="mr-2"
                      id={`eval-${e.id}`}
                    />
                    <label htmlFor={`eval-${e.id}`} className="text-gray-700">
                      {e.nombre}
                    </label>
                  </>
                ) : (
                  <span className="text-gray-700">{e.nombre}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {mode === "assign" && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1 bg-cta text-white rounded hover:opacity-90"
              onClick={() => onSave(selectedIds)}
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignacionesModal;
