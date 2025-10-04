import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Import, UploadCloud } from "lucide-react";

export default function CsvUploader() {
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [data, setData] = useState(null);
  const [showErrores, setShowErrores] = useState(false);
  const [errores, setErrores] = useState([]);
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        nombre_completo: "Carlos Hugo Pérez Ramírez",
        ci: "1906713",
        institucion: "Unidad Educativa Bolívar",
        departamento: "Santa Cruz",
        grado: "6to",
        area: "Matemáticas",
        estado: "VALIDADA",
      },
      {
        id: 2,
        nombre_completo: "Ricardo Raúl Rojas Flores",
        ci: "8439429",
        institucion: "Colegio Anglo Americano",
        departamento: "Tarija",
        grado: "5to",
        area: "Física",
        estado: "PENDIENTE",
      },
    ];
    setLista(fakeData);
  }, []);

  const REQUIRED_FIELDS = [
    "nombre completo",
    "ci",
    "contacto tutor legal",
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
      .normalize("NFD")
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
        setSuccess(false);
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

  const exportarErroresCSV = () => {
    if (errores.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,Fila,Error\n";
    errores.forEach((e) => {
      csvContent += `${e.fila},"${e.error.replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "errores_importacion.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    try {
      if (!fileInputRef.current.files[0]) {
        setError("No se seleccionó ningún archivo.");
        return;
      }

      setIsImporting(true);
      setSuccess(false);
      setErrores([]);

      const formData = new FormData();
      formData.append("archivo", fileInputRef.current.files[0]);

      const response = await fetch("http://127.0.0.1:8000/api/users/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Error al importar el archivo");
        return;
      }

      setData(result);

      if (result.errores && result.errores.length > 0) {
        setErrores(result.errores);
      }

      // 📌 Agregar los registros importados a la lista general
      if (result.importados && result.importados.length > 0) {
        setLista((prev) => [...prev, ...result.importados]);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Zona de carga CSV */}
      <div
        className={`w-full  border-2 ${
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
        <Import size={60} className="mx-auto text-gray-500 mb-4 " />
        <h4 className="text-gray-600 font-bold mb-4">
          Suelta tu archivo CSV aquí o haz clic para seleccionar
        </h4>
        <p className="text-gray-600 font-medium ">
          Campos requeridos: Nombre Completo, CI, Contacto tutor legal, Unidad
          educativa, Departamento, Grado, Área(s), Nivel, Tutor académico
          (opcional).
        </p>
        <p className="text-gray-600 font-medium ">
          Solo se admiten archivos con extension .CSV
        </p>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {/* Errores de validación */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 w-full  text-center">
          <p className="mt-4  p-4 text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {/* Previsualización antes de importar */}
      {!error && records.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 w-full max-w-lg text-center">
          <p className="text-green-700 font-semibold">
            ✅ Archivo cargado correctamente
          </p>
          <p className="text-green-600">
            Se detectaron <strong>{records.length}</strong> registros listos
            para importar.
          </p>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isImporting ? "Importando..." : "Importar"}
          </button>
        </div>
      )}

      {/* Reporte General */}
      {(success || errores.length > 0) && data && (
        <div className="mt-8 w-full max-w-4xl bg-gray-50 border rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📊 Reporte de Importación
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {data.insertados}
              </p>
              <p className="text-green-800">
                Registros insertados correctamente
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-700">
                {errores.length}
              </p>
              <p className="text-red-800">Errores encontrados</p>
            </div>
          </div>
          {errores.length > 0 && (
            <div className="mb-6 text-right">
              <button
                onClick={() => setShowErrores(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ver errores
              </button>
            </div>
          )}
        </div>
      )}

      {/* 📌 Lista General de Inscritos */}
      <div className="mt-8 w-full max-w-5xl bg-white border rounded-xl p-6 shadow">
        <h2 className="text-lg font-bold mb-4">📋 Lista de Inscritos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Nombre</th>
                <th className="border px-3 py-2">CI</th>
                <th className="border px-3 py-2">Institución</th>
                <th className="border px-3 py-2">Departamento</th>
                <th className="border px-3 py-2">Grado</th>
                <th className="border px-3 py-2">Área</th>
                <th className="border px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{item.id}</td>
                  <td className="border px-3 py-2">{item.nombre_completo}</td>
                  <td className="border px-3 py-2">{item.ci}</td>
                  <td className="border px-3 py-2">{item.institucion}</td>
                  <td className="border px-3 py-2">{item.departamento}</td>
                  <td className="border px-3 py-2">{item.grado}</td>
                  <td className="border px-3 py-2">{item.area}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        item.estado === "VALIDADA"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-gray-500 text-sm">{lista.length} resultados</p>
      </div>

      {/* Modal de errores */}
      {showErrores && errores.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowErrores(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-red-700">
                ⚠️ Se encontraron {errores.length} errores en la importación
              </h2>
              <button
                onClick={exportarErroresCSV}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Descargar CSV
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-red-100">
                  <tr>
                    <th className="border px-3 py-2">Fila</th>
                    <th className="border px-3 py-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {errores.map((e, index) => (
                    <tr key={index} className="hover:bg-red-50">
                      <td className="border px-3 py-2">{e.fila}</td>
                      <td className="border px-3 py-2 text-red-600">
                        {e.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowErrores(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
