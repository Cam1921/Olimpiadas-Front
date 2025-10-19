// src/pages/dashboard/gestionInscripciones/GestionInscripciones.jsx
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Download, FileWarning } from "lucide-react";
import GestionInscripciones from "./ListaCompetidores";
import api from "@/lib/api";

export default function InscripcionesManagement() {
  const [file, setFile] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [confirmedData, setConfirmedData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isFormatValid, setIsformatValid] = useState(true);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.endsWith(".csv")) {
      setIsformatValid(false);
      return;
    }
    setFile(selected);
    resetValidation();
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    resetValidation();
    if (!dropped) return;
    if (!dropped.name.endsWith(".csv")) {
      setIsformatValid(false);
      setFile(null);
      return;
    }
    setFile(dropped);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const resetValidation = () => {
    setIsValidated(false);
    setConfirmedData([]);
    setResponseData(null);
  };

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError(null);
        setFile(null);
        setResponseData(null);
        setIsValidated(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [validationError]);

  useEffect(() => {
    if (!isFormatValid) {
      const timer = setTimeout(() => {
        setIsformatValid(true);
      }, 6000);
    }
  }, [isFormatValid]);
  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => {
        setImportSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  const handleValidateFile = async () => {
    if (!file) return;
    setIsValidating(true);
    try {
      const formData = new FormData();
      formData.append("archivo", file);

      const previewResponse = await api.post("importaciones/preview", formData);
      console.log(previewResponse);
      const previewResult = previewResponse.data;
      if (previewResult.status === "success") {
        console.log("validado con exito");
        setResponseData(previewResult);
        setIsValidated(true);
      }
    } catch (error) {
      if (error.response?.data?.status === "error") {
        const previewResult = error.response.data;
        setValidationError(previewResult);

        switch (previewResult.message) {
          case "Encabezados requeridos faltantes":
            toast.error("Encabezados requeridos faltantes");
            break;
          case "El archivo contiene encabezados no válidos o desconocidos":
            toast.error("Encabezados inválidos o desconocidos");
            break;
          case "Validado con errores":
            setValidationError(null);
            setResponseData(previewResult);
            setIsValidated(true);
            break;
          default:
            toast.error(previewResult.message);
        }
      } else {
        toast.error("Error al validar CSV");
        console.error(error);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleImportFile = async () => {
    if (!responseData?.meta?.import_id) {
      toast.error("No se encontró el identificador de importación");
      return;
    }

    setIsImporting(true);
    const importId = responseData.meta.import_id;

    try {
      const response = await api.post("/importaciones/confirmar", {
        import_id: importId,
      });
      const result = response.data;
      console.log("📦 Confirm Import Result:", result);

      if (result.status === "success") {
        toast.success("Inscritos importados correctamente");
        setConfirmedData(
          result.data.map((item, index) => ({
            id: index + 1,
            nombre: item["nombres"] || "—",
            ci: item["ci"] || "—",
            unidad_educativa: item["unidad educativa"] || "—",
            departamento: item["departamento"] || "—",
            grado: item["grado"] || "—",
            area: item["area"] || "—",
            nivel: item["nivel"] || "—",
            contacto_tutor_legal: item["contacto tutor legal"] || "—",
            contacto_tutor_academico: item["contacto tutor academico"] || "—",
            nombre_equipo: item["nombre equipo"] || "—",
          }))
        );
        setImportSuccess(true);
        setIsValidated(false);
        setResponseData(null);
        setFile(null);
      } else {
        toast.error(result.message || "Error al confirmar la importación");
      }
    } catch (error) {
      console.error(" Error al confirmar la importación:", error);
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

      const response = await api.get("/importaciones/errores", {
        params: { import_id: importId },
        headers: { Accept: "text/csv" },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `errores_validacion_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Reporte de errores descargado con éxito");
    } catch (error) {
      console.error("Error al descargar reporte de errores:", error);
      toast.error("Ocurrió un error al descargar el archivo");
    }
  };

  return (
    <div className="p-3 lg:p-5 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h2 className=" font-semibold text-gray-800">
          Gestión de Inscripciones
        </h2>
        <p className="text-gray-600">
          Importa inscritos desde CSV y genera listas por área y nivel.
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 space-y-6 border">
        <h2 className=" font-medium">Importar inscritos (CSV)</h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("csv-input").click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition 
        ${
          isDragging
            ? "border-blue-400 bg-blue-100/40"
            : "border-gray-300 hover:border-blue-400"
        }`}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p
            className="text-lg font-semibold mb-4 truncate max-w-full text-center px-2"
            title={file ? file.name : ""}
          >
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
        {!isFormatValid && (
          <div className="p-4 mb-4 border border-red-400 bg-red-50/40 rounded-xl flex items-center gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Formato inválido</p>
              <p className="text-red-600 text-sm">
                Solo se admiten archivos con extensión .csv.
              </p>
            </div>
          </div>
        )}
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
            <button
              onClick={() => setValidationError(null)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-lg"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
              <span>
                <FileWarning size={40} />
              </span>{" "}
              Error en el archivo
            </h4>

            <p className="text-red-600 mb-3">{validationError.message}</p>

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
                className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isImporting || isValidating}
                className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white px-4 py-2 rounded-lg"
              >
                {isValidating ? "Validando..." : "Validar archivo"}
              </button>
            </div>
          </>
        )}

        {isValidated && responseData?.status === "error" && (
          <>
            {/* <div className="flex w-full flex-row flex-start p-3 items-start gap-3 border rounded-lg bg-white">
              <CheckCircleIcon className="h-4 w-4" />
              <div className="gap-2">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  Archivo validado correctamente.
                </p>
                <button
                  onClick={handleImportFile}
                  disabled={isImporting || responseData.meta.valid_rows === 0}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? "Importando..." : "Importar inscritos"}
                </button>
              </div>
            </div> */}
            <div
              className={`p-4 border rounded-lg flex flex-row gap-4  ${"border-red-400 bg-white"}`}
            >
              <CheckCircleIcon className="h-4 w-4" />
              <div className="flex flex-col gap-3">
                <p className="font-semibold">
                  {responseData.message} no es posible importar los competidores{" "}
                  <span>
                    (Intente nuevamente con un archivo con los campos requeridos
                    correctos)
                  </span>
                </p>
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
                <h4 className="font-semibold mb-2">
                  Resumen de Errores detectados
                </h4>
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
                        responseData.errors.slice(0, 10).map((err, i) => (
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

      <div className="bg-white shadow rounded-lg p-6 border space-y-4">
        <h2 className=" font-semibold text-gray-800">
          Listas por Área y Nivel
        </h2>

        <GestionInscripciones importedData={confirmedData} />
      </div>
    </div>
  );
}
