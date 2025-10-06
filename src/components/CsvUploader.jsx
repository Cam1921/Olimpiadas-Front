import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Import, X, Download } from "lucide-react";
import ImportResult from "./ImportResult";

export default function CsvUploader() {
  const [errorMsg, setErrorMsg] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [records, setRecords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [showErrores, setShowErrores] = useState(false);
  const [lista, setLista] = useState([]);
  const [importId, setImportId] = useState(null);
  const fileInputRef = useRef(null);
  const [informatio, setInformatio] = useState(null);

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

  const errores = [
    {
      fila: 23,
      motivo: "CI duplicado en la base de datos",
      columna: "CI",
      valor: "12345678",
    },
    { fila: 45, motivo: "Área no válida", columna: "Área", valor: "Robótica" },
    {
      fila: 67,
      motivo: "Campo Nivel es obligatorio",
      columna: "Nivel",
      valor: "—",
    },
    {
      fila: 89,
      motivo: "Formato de CI inválido",
      columna: "CI",
      valor: "12AB3456",
    },
    {
      fila: 112,
      motivo: "Unidad Educativa muy larga",
      columna: "Unidad Educativa",
      valor: "Colegio Nacional San Andrés …",
    },
    {
      fila: 134,
      motivo: "Departamento no válido",
      columna: "Departamento",
      valor: "Lima",
    },
    {
      fila: 145,
      motivo: "Grado debe ser numérico",
      columna: "Grado",
      valor: "Primero",
    },
    {
      fila: 178,
      motivo: "Contacto tutor legal faltante",
      columna: "Contacto Tutor Legal",
      valor: "—",
    },
  ];
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
      setErrorMsg("Solo se permiten archivos con extensión .csv");
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
          setErrorMsg(
            `El archivo CSV no contiene los campos requeridos: ${missing.join(
              ", "
            )}`
          );
          setRecords([]);
          return;
        }

        setErrorMsg("");
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

  const handleImport = async () => {
    try {
      if (!fileInputRef.current.files[0]) {
        setErrorMsg("No se seleccionó ningún archivo.");
        return;
      }

      setIsImporting(true);
      setSuccess(false);
      setErrorMsg("");
      setErrorList([]);

      const formData = new FormData();
      formData.append("archivo", fileInputRef.current.files[0]);

      // 🔍 Preview de validación
      const previewResponse = await fetch(
        "http://127.0.0.1:8000/api/importaciones/preview",
        {
          method: "POST",
          body: formData,
        }
      );

      const previewResult = await previewResponse.json();
      console.log("📦 Preview Result:", previewResult);

      if (previewResult.status === "error") {
        if (Array.isArray(previewResult.errors)) {
          setErrorList(previewResult.errors);
        } else {
          setErrorMsg(previewResult.errors || "Error desconocido");
        }
        return;
      }

      setData(previewResult);
      setImportId(previewResult?.meta?.import_id || null);
      setSuccess(true);
    } catch (err) {
      setErrorMsg("Error al validar el archivo: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const exportarErroresCSV = async () => {
    if (!importId) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/importaciones/errores?import_id=${importId}`
      );
      if (!res.ok) throw new Error("No se pudo descargar el CSV de errores.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "errores_importacion.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* 🟦 Zona de carga */}
      <div
        className={`w-full border-2 ${
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
          Solo se admiten archivos con extensión .CSV
        </p>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
        {/* Mensaje de archivo validado */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-semibold">
                ✓ Archivo validado correctamente.
              </span>
              <span className="text-gray-700">
                Se detectaron <strong>153 filas de datos.</strong>
              </span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow">
              Importar inscritos
            </button>
          </div>
        </div>

        {/* Mensaje de éxito */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-green-700 font-medium">
              ✓ Inscritos importados correctamente
            </p>
            <span className="text-sm text-green-800">
              156 filas procesadas, <strong>148 competidores creados</strong>, 8
              con errores.
            </span>
          </div>
          <div className="mt-3">
            <button className="flex items-center text-green-700 hover:text-green-800 text-sm font-medium">
              <Download size={18} className="mr-2" />
              Descargar reporte de errores (.CSV)
            </button>
          </div>
        </div>

        {/* Detalle de errores */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">
              Detalle de errores por fila
            </h2>
            <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
              8 errores
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 font-medium">Fila</th>
                <th className="py-3 px-4 font-medium">Motivo del error</th>
                <th className="py-3 px-4 font-medium">Columna</th>
                <th className="py-3 px-4 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {errores.map((err, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-red-50 transition"
                >
                  <td className="py-2 px-4 text-red-600 font-semibold">
                    #{err.fila}
                  </td>
                  <td className="py-2 px-4 text-red-600">{err.motivo}</td>
                  <td>
                    <span className="ml-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {err.columna}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-700">{err.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔴 Mensaje de error simple */}
      {errorMsg && !errorList.length && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 w-full text-center">
          <p className="text-red-600 font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* 🟢 Archivo cargado */}
      {!errorMsg && records.length > 0 && (
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
            {isImporting ? "Validando..." : "Validar"}
          </button>
        </div>
      )}

      {/* 🧾 Reporte */}
      {success && data && (
        <div className="mt-8 w-full max-w-4xl bg-gray-50 border rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📊 Reporte de Importación
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {data?.meta?.valid_rows || 0}
              </p>
              <p className="text-green-800">Registros válidos</p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-700">
                {data?.meta?.invalid_rows || 0}
              </p>
              <p className="text-red-800">Registros inválidos</p>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ MODAL DE ERRORES */}
      {showErrores && errorList.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-4xl rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-red-600 text-white p-4">
              <h3 className="text-lg font-semibold">
                🚫 Errores detectados en el archivo
              </h3>
              <button
                onClick={() => setShowErrores(false)}
                className="hover:bg-red-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabla de errores */}
            <div className="p-6 max-h-[400px] overflow-y-auto">
              <table className="w-full border border-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="border px-3 py-2">Fila</th>
                    <th className="border px-3 py-2">Campo</th>
                    <th className="border px-3 py-2">Descripción del error</th>
                  </tr>
                </thead>
                <tbody>
                  {errorList.map((err, i) => (
                    <tr
                      key={i}
                      className="border hover:bg-red-50 transition-colors"
                    >
                      <td className="border px-3 py-2 text-center">
                        {err.row}
                      </td>
                      <td className="border px-3 py-2">{err.field}</td>
                      <td className="border px-3 py-2 text-red-600 font-medium">
                        {err.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center bg-gray-50 p-4 border-t">
              <button
                onClick={exportarErroresCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download size={18} /> Exportar errores CSV
              </button>
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
