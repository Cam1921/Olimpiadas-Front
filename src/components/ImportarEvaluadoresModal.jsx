import React, { useState } from "react";

export default function ImportarEvaluadoresModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  if (!open) return null; // si está cerrado, no renderiza nada

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".csv")) {
      setStatusMsg("El archivo debe ser formato .csv");
      setFile(null);
      return;
    }

    setFile(f);
    setStatusMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatusMsg("Por favor selecciona un archivo CSV primero.");
      return;
    }

    if (onUpload) {
      await onUpload(file);
    }

    setStatusMsg("Archivo listo para enviar ✅ (simulado)");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-sm"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-slate-800">
          Importar Evaluadores por CSV
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Sube un archivo CSV con las columnas requeridas (nombre, apellido, CI,
          correo, teléfono, área y nivel).
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* INPUT ARCHIVO */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Archivo CSV
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg
                         file:border file:border-slate-300 file:bg-slate-50
                         file:text-slate-700 hover:file:bg-slate-100
                         cursor-pointer"
            />

            {file && (
              <p className="text-xs text-slate-600">
                Seleccionado:{" "}
                <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* STATUS / MENSAJE */}
          {statusMsg && (
            <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-2">
              {statusMsg}
            </div>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
            >
              Cargar archivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}