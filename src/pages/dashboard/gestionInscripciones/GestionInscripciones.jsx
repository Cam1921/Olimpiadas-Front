import React, { useState, useCallback, useEffect } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  Download,
  FileWarning,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";

const mockCompetitors = [
  {
    id: "1",
    name: "Juan Carlos Pérez",
    ci: "12345678",
    school: "Colegio San Andrés",
    department: "La Paz",
    area: "Matemáticas",
    level: "Secundaria",
    tutor: "Prof. María González",
    status: "VALIDADA",
  },
  {
    id: "2",
    name: "Ana María Rodriguez",
    ci: "87654321",
    school: "Unidad Educativa Central",
    department: "Santa Cruz",
    area: "Física",
    level: "Secundaria",
    status: "PENDIENTE",
  },
  {
    id: "3",
    name: "Pedro Luis Mamani",
    ci: "11223344",
    school: "Colegio Boliviano",
    department: "Cochabamba",
    area: "Matemáticas",
    level: "Primaria",
    tutor: "Prof. Carlos Quispe",
    status: "VALIDADA",
  },
];

const areas = [
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Informática",
  "Astronomía",
  "Geografía",
];
const levels = ["Primaria", "Secundaria"];
const REQUIRED_COLUMNS = [
  "nombre completo",
  "ci",
  "contacto tutor legal",
  "unidad educativa",
  "departamento",
  "grado",
  "área",
  "nivel",
];

export default function GestionInscripcionest() {
  const [file, setFile] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [confirmedData, setConfirmedData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [responseData, setResponseData] = useState(null);

  // --- manejo de archivo ---
  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    resetValidation();
    if (!selected) return;
    if (!selected.name.endsWith(".csv")) {
      toast.error("Solo se admiten archivos CSV");
      return;
    }
    setFile(selected);
    resetValidation();
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];
    resetValidation();
    if (!dropped) return;
    if (!dropped.name.endsWith(".csv")) {
      toast.error("Solo se admiten archivos CSV");
      return;
    }
    setFile(dropped);
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  const resetValidation = () => {
    setIsValidated(false);
    setConfirmedData([]);
    setResponseData(null);
  };

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError(null); // Limpiar el error después de X segundos
        setFile(null);
        setResponseData(null);
        setIsValidated(false);
      }, 5000); // 5000 ms = 5 segundos

      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta o cambia el error
    }
  }, [validationError]);
  // --- validar archivo ---
  const handleValidateFile = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("archivo", file);

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
        setValidationError(previewResult);
        if (previewResult.message == "Encabezados requeridos faltantes") {
          toast.error("Encabezados requeridos faltantes");
          console.log("los encabezados faltan");
        } else if (
          previewResult.message ==
          "El archivo contiene encabezados no válidos o desconocidos"
        ) {
          console.log(
            "El archivo contiene encabezados no válidos o desconocidos"
          );
        } else if (previewResult.message == "Validado con errores") {
          setValidationError(null);
          setResponseData(previewResult);
          setIsValidated(true);
          console.log(previewResult);
          console.log("Validado con errores");
        }
      } else if (previewResult.status === "success") {
        console.log("validado con exito");
        setResponseData(previewResult); // Guardamos info
        setIsValidated(true);
      }
    } catch (error) {
      toast.error("Error al validar CSV");
      /*  setResponse(
      { : 23, reason: "CI duplicado", column: "CI", value: "12345678" },
      { row: 45, reason: "Área no válida", column: "Área", value: "Robótica" }
    ); */
      console.log("se produjo un error al realizar la peticion");
    }
  };

  // --- importar ---
  const handleImportFile = async () => {
    if (!responseData?.meta?.import_id) {
      toast.error("No se encontró el identificador de importación");
      return;
    }

    setIsImporting(true);
    const importId = responseData.meta.import_id;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/importaciones/confirmar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            import_id: importId,
          }),
        }
      );

      const result = await response.json();
      console.log("📦 Confirm Import Result:", result);

      if (response.ok && result.status === "success") {
        toast.success("✅ Inscritos importados correctamente");
        setConfirmedData(result.data);
        setImportSuccess(true);
        setIsValidated(false);
        setResponseData(null);
        setFile(null);
      } else {
        toast.error(result.message || "Error al confirmar la importación");
      }
    } catch (error) {
      console.error("❌ Error al confirmar la importación:", error);
      toast.error("Error de conexión al confirmar la importación");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadErrors = async () => {
    if (!responseData?.meta?.import_id) {
      toast.error("No se encontró el identificador de importación");
      return;
    }

    try {
      const importId = responseData.meta.import_id;

      // Hacer la petición GET al backend
      const response = await fetch(
        `http://127.0.0.1:8000/api/importaciones/errores?import_id=${importId}`,
        {
          method: "GET",
          headers: {
            Accept: "text/csv",
          },
        }
      );

      if (!response.ok) {
        toast.error("No se pudo descargar el reporte de errores");
        return;
      }

      // Convertir la respuesta en un archivo descargable
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear enlace temporal para descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `errores_validacion_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reporte de errores descargado");
    } catch (error) {
      console.error("❌ Error al descargar reporte de errores:", error);
      toast.error("Ocurrió un error al descargar el archivo");
    }
  };
  // --- filtrado ---
  const filteredCompetitors = competitors.filter((c) => {
    const byArea = selectedArea === "all" || c.area === selectedArea;
    const byLevel = selectedLevel === "all" || c.level === selectedLevel;
    const bySearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ci.includes(searchTerm) ||
      c.school.toLowerCase().includes(searchTerm.toLowerCase());
    return byArea && byLevel && bySearch;
  });

  const getStatusBadge = (status) => {
    const colors = {
      VALIDADA: "bg-green-500 text-white",
      PENDIENTE: "bg-yellow-500 text-white",
      ANULADA: "bg-red-500 text-white",
    };
    return (
      <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h2 className=" font-semibold text-gray-800">
          Gestión de Inscripciones
        </h2>
        <p className="text-gray-600">
          Importa inscritos desde CSV y genera listas por área y nivel.
        </p>
      </div>

      {/* --- Importar CSV --- */}
      <div className="bg-white shadow rounded-xl p-6 space-y-6 border">
        <h2 className=" font-medium">Importar inscritos (CSV)</h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("csv-input").click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition"
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-4">
            {file
              ? file.name
              : "Suelta tu archivo CSV aquí o haz clic para seleccionar"}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Campos requeridos: Nombre Completo, CI, Contacto tutor legal, Unidad
            educativa, Departamento, Grado, Área(s), Nivel, Tutor académico
            (opcional).
          </p>
          <p className="text-sm text-gray-500">
            Solo se admiten archivos con extensión .CSV
          </p>
        </div>
        {importSuccess && (
          <div className="p-4 mb-4 border border-green-400 bg-green-50/40 rounded-xl flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">
                ¡Importación exitosa!
              </p>
              <p className="text-green-600 text-sm">
                Se importaron {confirmedData.length} inscritos correctamente.
              </p>
            </div>
          </div>
        )}
        {validationError && validationError.status === "error" && (
          <div className="mt-4 bg-red-50/30 border border-red-300 rounded-xl p-4 w-full text-left">
            <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
              <span>
                <FileWarning size={40} />
              </span>{" "}
              Error en el archivo
            </h4>

            <p className="text-red-600 mb-3">{validationError.message}</p>

            {/* 🔸 Caso 1: Faltan encabezados requeridos */}
            {validationError.error_type === "requered headers missing" && (
              <>
                <p className="text-gray-700 font-medium">
                  Encabezados detectados:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                  {validationError.meta?.found_headers?.map((header, index) => (
                    <li key={index}>{header}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600">
                  Algunos encabezados requeridos no están presentes. Verifica
                  que tu archivo incluya todos los campos necesarios:
                  <br />
                  <span className="font-semibold">
                    Nombre Completo, CI, Contacto tutor legal, Unidad educativa,
                    Departamento, Grado, Área(s), Nivel, Tutor académico
                    (opcional)
                  </span>
                </p>
              </>
            )}

            {/* 🔸 Caso 2: Encabezados inválidos */}
            {validationError.message ===
              "El archivo contiene encabezados no válidos o desconocidos" && (
              <>
                <p className="text-gray-700 font-medium">
                  Encabezados detectados:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                  {validationError.meta?.found_headers?.map((header, index) => (
                    <li key={index}>{header}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600">
                  <span></span> Tu archivo contiene encabezados desconocidos o
                  mal escritos. Asegúrate de usar exactamente los siguientes
                  nombres:
                  <br />
                  <span className="font-semibold">
                    Nombre Completo, CI, Contacto tutor legal, Unidad educativa,
                    Departamento, Grado, Área(s), Nivel, Tutor académico
                    (opcional)
                  </span>
                </p>
              </>
            )}
          </div>
        )}
        {isValidated &&
          responseData?.status === "success" &&
          responseData?.meta.invalid_rows === 0 && (
            <div className="p-4 mb-4 border border-green-400 bg-green-50/40 rounded-xl flex justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-700">
                    ¡Archivo validado con éxito!
                  </p>
                  <p className="text-green-600 text-sm">
                    Se procesaron {responseData.meta.total_rows} filas y todas
                    son correctas.
                  </p>
                </div>
              </div>

              <button
                onClick={handleImportFile}
                disabled={isImporting || responseData.meta.valid_rows === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? "Importando..." : "Importar inscritos"}
              </button>
            </div>
          )}

        {!validationError && file && !isValidated && (
          <>
            <div className="flex w-full  flex-row justify-between px-5  items-center gap-3">
              <p>
                Coma <span>(,)</span>
              </p>
              <p>Tiene fila de encabezados</p>
              <button
                onClick={handleValidateFile}
                disabled={isImporting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {isValidated ? "Validando..." : "Validar archivo"}
              </button>
            </div>
          </>
        )}

        {isValidated && responseData?.status === "error" && (
          <>
            <div className="flex w-full flex-row flex-start p-3 items-start gap-3 border rounded-lg bg-white">
              <CheckCircleIcon className="h-4 w-4" />
              <div className="gap-2">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  Archivo validado correctamente.
                </p>
                <button
                  onClick={handleImportFile}
                  disabled={isImporting || responseData.meta.valid_rows === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? "Importando..." : "Importar inscritos"}
                </button>
              </div>
            </div>
            <div
              className={`p-4 border rounded-lg flex flex-row gap-4  ${"border-green-400 bg-white"}`}
            >
              <CheckCircleIcon className="h-4 w-4" />
              <div className="gap-3">
                <p className="font-semibold">Validación exitosa</p>
                <p className="text-sm text-gray-700">
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    {responseData.meta.total_rows}
                  </span>{" "}
                  filas procesadas{" "}
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    {responseData.meta.valid_rows}
                  </span>{" "}
                  filas correctas{" "}
                  <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                    {responseData.meta.invalid_rows}
                  </span>{" "}
                  filas con errores.{" "}
                </p>

                <div
                  onClick={handleDownloadErrors}
                  className="flex items-center gap-2 text-sm cursor-pointer text-blue-600"
                >
                  <span>
                    {" "}
                    <Download size={16} />
                  </span>{" "}
                  Descargar reporte de errores (.CSV)
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold mb-2">Errores detectados</h4>
                <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                  {responseData.meta.invalid_rows} errores
                </span>
              </div>

              <div className="border-base-content/25 w-full rounded-lg border bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="  h-10 ">
                        <th className="text-start px-2 ">Fila</th>
                        <th className="text-start px-2">Columna</th>
                        <th className="text-start px-2">Motivo de error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseData &&
                        responseData.errors &&
                        responseData.errors.map((err, i) => (
                          <tr key={i} className="border-t h-10">
                            <td className="text-start px-2 ">
                              <span>#</span>
                              {err.row}
                            </td>
                            <td className="text-start px-2">
                              <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                {err.field}
                              </span>
                            </td>
                            <td className="text-start px-2 text-red-600">
                              {" "}
                              {err.error}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Listas filtradas --- */}
      <div className="bg-white shadow rounded-lg p-6 border space-y-4">
        <h3 className="text-lg font-medium">Listas por Área y Nivel</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Área</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="all">Todas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nivel</label>
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setSelectedLevel(selectedLevel === level ? "all" : level)
                  }
                  className={`px-3 py-1 rounded border ${
                    selectedLevel === level
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Por nombre, CI o colegio"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">CI</th>
                <th className="p-2 text-left">Unidad Educativa</th>
                <th className="p-2 text-left">Departamento</th>
                <th className="p-2 text-left">Área</th>
                <th className="p-2 text-left">Nivel</th>
                <th className="p-2 text-left">Tutor</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(confirmedData.length > 0
                ? confirmedData
                : filteredCompetitors
              ).map((c, index) => (
                <tr key={c.id || index} className="border-t hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2 font-mono">{c.ci}</td>
                  <td className="p-2">{c.school}</td>
                  <td className="p-2">{c.department}</td>
                  <td className="p-2">{c.area}</td>
                  <td className="p-2">{c.level}</td>
                  <td className="p-2">{c.tutor || "—"}</td>
                  <td className="p-2">{getStatusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {filteredCompetitors.length} resultados
        </p>
      </div>
    </div>
  );
}
