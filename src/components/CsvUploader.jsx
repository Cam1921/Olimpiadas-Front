import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { UploadCloud } from "lucide-react"; // Icono de subida (lucide-react)

export default function CsvUploader() {
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const REQUIRED_FIELDS = [
    "nombre completo",
    "ci",
    "nombre tutor legal",
    "teléfono tutor legal",
    "unidad educativa",
    "departamento",
    "grado",
    "área",
    "nivel",
  ];
  const OPTIONAL_FIELDS = ["Tutor académico"];

  const normalize = (str) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD") // elimina tildes
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Solo se permiten archivos con extensión .csv");
      setRecords([]);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields.map(normalize);

        const missing = REQUIRED_FIELDS.filter(
          (field) => !headers.includes(normalize(field))
        );

        if (missing.length > 0) {
          setError(
            `El archivo CSV no contiene los campos requeridos: ${missing.join(
              ", "
            )}`
          );
          setRecords([]);
          return;
        }

        setError("");
        setRecords(results.data);
      },
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className={`w-full max-w-lg border-2 ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } border-dashed rounded-2xl p-10 text-center cursor-pointer transition`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <UploadCloud size={48} className="mx-auto text-gray-500 mb-4" />
        <p className="text-gray-600 font-medium">
          Suelta tu archivo CSV aquí o haz clic para seleccionar
        </p>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {/* Mensajes */}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {!error && records.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 w-full max-w-lg text-center">
          <p className="text-green-700 font-semibold">
            ✅ Archivo cargado correctamente
          </p>
          <p className="text-green-600">
            Se importaron <strong>{records.length}</strong> registros.
          </p>
        </div>
      )}
    </div>
  );
}
