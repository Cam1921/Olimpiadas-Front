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
  console.log("evaluadores seleccionados", evaluadores);
  useEffect(() => {
    if (mode === "assign" || mode === "delete") {
      setSelectedIds([]);
    }
  }, [mode, seleccionados]);

  const toggleSelect = (id_persona) => {
    if (selectedIds.includes(id_persona)) {
      setSelectedIds(selectedIds.filter((i) => i !== id_persona));
    } else {
      setSelectedIds([...selectedIds, id_persona]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === "view" && "Evaluadores Asignados"}
            {mode === "assign" && "Asignar Evaluadores"}
            {mode === "delete" && "Eliminar Asignaciones"}
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
              <li key={e.id_persona} className="flex items-center">
                {mode === "assign" || mode === "delete" ? (
                  <>
                    <label
                      htmlFor={`eval-${e.id_persona}`}
                      className="flex items-start gap-3 p-3 w-full rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(e.id_persona)}
                        onChange={() => toggleSelect(e.id_persona)}
                        className="mt-1 h-4 w-4"
                        id={`eval-${e.id_persona}`}
                      />

                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {e.nombres} {e.apellidos}
                        </span>
                        <span className="text-sm text-gray-500">
                          CI: {e.ci}
                        </span>
                      </div>
                    </label>
                  </>
                ) : (
                  <div className="text-gray-800">
                    <p className="font-semibold text-lg">
                      {e.nombres} {e.apellidos}
                    </p>
                    <p className="text-sm text-gray-600">
                      CI: <span className="font-medium">{e.ci}</span>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {(mode === "assign" || mode === "delete") && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className={`
                px-3 py-1 rounded text-white
                ${mode === "assign" ? "bg-cta" : "bg-red-500"}
              `}
              onClick={() => onSave(selectedIds)}
            >
              {mode === "assign" ? "Guardar" : "Eliminar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignacionesModal;
