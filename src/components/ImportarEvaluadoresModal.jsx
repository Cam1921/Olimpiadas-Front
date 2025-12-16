// src/components/ImportarEvaluadoresModal.jsx
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { Button } from "./Button";
import {
  AlertTriangle,
  CheckCircle2,
  CheckCircleIcon,
  FileWarning,
  Import,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Progress } from "./Progres";
import ModalAreasNiveles from "./ModalAreasNiveles";
import { IoWarningOutline } from "react-icons/io5";
import { RiInformationLine } from "react-icons/ri";

export default function ImportarEvaluadoresModal({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [importStep, setImportStep] = useState("select");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [errores, setErrores] = useState([]);
  const [importId, setImportId] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuideAreasNiveles, setShowGuideAreasNiveles] = useState(false);

  if (!open) return null;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setImportStep("file-loaded");
    setStatusMsg("");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImportStep("select");
    fileInputRef.current.value = "";
  };

  const simulateProgress = (callback) => {
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          callback?.();
          return 100;
        }
        return next;
      });
    }, 150);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleValidateFile = async () => {
    if (!file) {
      toast.error("Por favor selecciona un archivo CSV primero.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);
    setImportStep("processing");
    simulateProgress(async () => {
      try {
        setStatusMsg("Validando archivo...");

        const res = await api.post("/evaluadores/import/preview", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { data } = res;

        setImportId(data.meta.import_id);
        setErrores(data.errors || []);
        setImportStep("file-validated");
        setImportResult(data);
      } catch (error) {
        console.error(error);
        if (error.response?.data?.status === "error") {
          setImportResult(error.response.data);
          setImportStep("file-validated");
        }
        toast.error("Error al validar el archivo CSV");
      } finally {
        setStatusMsg(null);
        console.log(importResult);
      }
    });
  };
  const handleBeforeClose = () => {
    // 🔹 1. Ejecutas lo que necesites
    console.log("Limpieza antes de cerrar");
    setFile(null);
    setImportResult(null);
    setImportStep("select");

    // 🔹 2. Luego llamas al onClose real (padre)
    if (onClose) onClose();
  };
  const handleBeforeImport = () => {
    // 🔹 2. Luego llamas al onClose real (padre)
    if (onImport) onImport();
    setImportStep("select");
    // 🔹 1. Ejecutas lo que necesites
    console.log("Limpieza antes de cerrar");
    setFile(null);
    setImportResult(null);
  };

  const handleConfirmImport = async () => {
    if (!importResult?.meta?.import_id) return;
    setImportStep("processing");
    setStatusMsg("Validando archivo...");
    simulateProgress(async () => {
      try {
        const importID = importResult?.meta?.import_id;
        const res = await api.post(`/evaluadores/import/confirmar`, {
          import_id: importID,
        });
        const { data } = res;
        setImportId(data.meta.import_id);
        setErrores(data.errors || []);
        setImportStep("file-confirmed");
        setImportResult(data);
      } catch (error) {
        console.error(error);
        toast.error("Error al confirmar la importación");
      } finally {
        setStatusMsg(null);
        console.log(importResult);
      }
    });
  };

  const handleDownloadErrors = async () => {
    if (!importResult?.meta?.import_id) {
      toast.error("No se encontró el identificador de importación");
      return;
    }
    try {
      const importId = importResult.meta.import_id;

      const response = await api.get("/evaluadores/import/errores", {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto w-full max-w-2xl p-6 relative">
        <button
          onClick={handleBeforeClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-sm"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-slate-800">
          Importar Evaluadores por CSV
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Sube un archivo CSV con las columnas requeridas: Nombre, Apellidos,
          Correo, Teléfono, CI, Área y Nivel (opcional).
        </p>
        <div className="flex justify-end mb-4 gap-3">
          <Button size="sm" onClick={() => setShowGuide(true)}>
            <span>
              <RiInformationLine className="h-5 w-5 text-white" />
            </span>
            Ver guía de campos
          </Button>
        </div>

        {/* === Paso 1: Seleccionar archivo === */}
        {importStep === "select" && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-blue-600 transition-colors cursor-pointer bg-muted/10"
            >
              <DocumentArrowUpIcon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <p className="text-base text-foreground mb-2">
                Arrastra tu archivo CSV aquí
              </p>
              <p className="text-small text-muted-foreground">
                o haz clic para seleccionar
              </p>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept=".csv"
                className="hidden"
              />
            </div>
            <div className="w-full py-3 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}

        {/* === Paso 2: Archivo cargado === */}
        {importStep === "file-loaded" && file && (
          <>
            <div className="w-full border-2 border-border rounded-lg p-4 ">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentArrowUpIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-small text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-none text-red-600"
                onClick={() => {
                  setFile(null);
                  setImportStep("select");
                }}
              >
                <span>X</span> Eliminar archivo
              </Button>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleBeforeClose}>
                Cancelar
              </Button>
              <Button onClick={handleValidateFile}>Validar archivo</Button>
            </div>
          </>
        )}

        {/* === Paso 3: Resultado validación === */}
        {importStep === "file-validated" && (
          <div className="space-y-4">
            {importResult.status == "error" ? (
              <>
                {importResult.errors?.length > 0 &&
                importResult.message == "Validado con errores" ? (
                  <>
                    {/* ⚠️ Mensaje de advertencia */}
                    <div>
                      <div className="flex  flex-col gap-2 border border-yellow-200 bg-yellow-50 p-3 rounded-lg">
                        <div className=" flex items-center gap-2 ">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          <span>
                            {importResult.meta.total_rows} filas en total
                          </span>
                        </div>
                        <div className=" flex items-center gap-2 ">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          <span>
                            {importResult.meta.valid_rows} filas validas
                          </span>
                        </div>
                        <div className=" flex items-center gap-2 ">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <span>
                            {importResult.meta.invalid_rows} filas con error
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ❌ Mensaje de error general */}
                    <div className="flex items-center gap-2 text-red-600 border border-red-200 bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="w-5 h-5" />
                      <span>
                        Se encontraron errores en el archivo. Corrige los datos
                        indicados e intenta nuevamente.
                      </span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h2 className="text-lg font-semibold text-gray-700 mb-1">
                        Reporte de Errores
                      </h2>
                      <table className="w-full text-sm border-t border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600">
                            <th className="py-2 px-3">Fila</th>
                            <th className="py-2 px-3">Campo</th>
                            <th className="py-2 px-3">Motivo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importResult.errors.map((err, i) => (
                            <tr key={i} className="border-t border-gray-200">
                              <td className="py-2 px-3">{err.row}</td>
                              <td className="py-2 px-3">{err.field}</td>
                              <td className="py-2 px-3 text-red-600">
                                {err.error}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between pt-3">
                      <Button onClick={handleDownloadErrors} variant="outline">
                        Descargar reporte de errores (.CSV)
                      </Button>
                      <Button onClick={handleBeforeClose} variant="outline">
                        Cerrar
                      </Button>
                    </div>
                  </>
                ) : importResult.message ==
                  "Encabezados requeridos faltantes" ? (
                  <>
                    <div className="mt-4 bg-red-50/30 border border-red-300 rounded-xl p-4 w-full text-left">
                      <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                        <span>
                          <FileWarning size={40} />
                        </span>{" "}
                        Error en el archivo
                      </h4>

                      <p className="text-red-600 mb-3">
                        {importResult.message}
                      </p>
                      <p className="text-gray-700 font-medium">
                        Encabezados detectados:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                        {importResult.meta?.found_headers?.map(
                          (header, index) => (
                            <li key={index}>{header}</li>
                          )
                        )}
                      </ul>
                      <p className="text-sm text-gray-600">
                        <span></span> Tu archivo contiene encabezados
                        desconocidos o mal escritos. Asegúrate de usar
                        exactamente los siguientes nombres:
                        <br />
                        <span className="font-semibold">
                          Nombre, Apellidos, Correo, teléfono, CI, Área, Nivel
                          (opcional)
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-end pt-3">
                      <Button onClick={handleBeforeClose} variant="outline">
                        Cerrar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-4 bg-red-50/30 border border-red-300 rounded-xl p-4 w-full text-left">
                      <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                        <span>
                          <FileWarning size={40} />
                        </span>{" "}
                        Error en el archivo
                      </h4>

                      <p className="text-red-600 mb-3">
                        {importResult.message}
                      </p>
                      <p className="text-gray-700 font-medium">
                        Encabezados detectados:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                        {importResult.meta?.found_headers?.map(
                          (header, index) => (
                            <li key={index}>{header}</li>
                          )
                        )}
                      </ul>
                      <p className="text-sm text-gray-600">
                        Algunos encabezados requeridos no están presentes.
                        Verifica que tu archivo incluya todos los campos
                        necesarios:
                        <br />
                        <span className="font-semibold">
                          Nombre, Apellidos, Correo, teléfono, CI, Área, Nivel
                          (opcional)
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-end pt-3">
                      <Button onClick={handleBeforeClose} variant="outline">
                        Cerrar
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-600 border border-green-200 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-green-700">
                      ¡Archivo validado con éxito!
                    </p>
                    <p className="text-green-600 text-sm">
                      Se procesaron {importResult.meta.total_rows} filas y todas
                      son correctas.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <Button variant="outline" onClick={handleBeforeClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmImport}>
                    Confirmar importación
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        {importStep === "file-confirmed" && (
          <>
            <div className="flex items-center gap-2 text-green-600 border border-green-200 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-semibold text-green-700">
                  ¡Importación exitosa!
                </p>
                <p className="text-green-600 text-sm">
                  Se importaron {importResult.meta?.total_rows} competidores
                  correctamente.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <Button onClick={handleBeforeImport}>Aceptar</Button>
            </div>
          </>
        )}

        {importStep === "processing" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-base text-foreground">
                Procesando archivo... validando filas
              </p>
            </div>
            <Progress value={processingProgress} className="w-full h-3" />
            <p className="text-base text-muted-foreground text-center">
              {processingProgress}% completado
            </p>
          </div>
        )}
        {showGuide && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Guía de campos CSV
                  </h2>
                  <p className="text-sm text-slate-500">
                    Formato y reglas para la importación de datos
                  </p>
                </div>

                <button
                  onClick={() => setShowGuide(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Campo</th>
                        <th className="px-4 py-3 font-medium">
                          Formato / Reglas
                        </th>
                        <th className="px-4 py-3 font-medium">Ejemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        {
                          campo: "Nombre",
                          regla: "Solo letras y espacios. Mínimo 3 caracteres.",
                          ejemplo: "Juan Pedro",
                        },
                        {
                          campo: "Apellidos",
                          regla: "Solo letras y espacios. Mínimo 3 caracteres.",
                          ejemplo: "Gómez López",
                        },
                        {
                          campo: "Correo",
                          regla: "Email válido y menor a 50 caracteres.",
                          ejemplo: "ejemplo@mail.com",
                        },
                        {
                          campo: "Teléfono",
                          regla: "Solo números, 8 dígitos, inicia con 6 o 7.",
                          ejemplo: "62345678",
                        },
                        {
                          campo: "CI",
                          regla: "Numérico entre 6 y 10 dígitos.",
                          ejemplo: "87654321",
                        },
                      ].map((row) => (
                        <tr
                          key={row.campo}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {row.campo}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.regla}
                          </td>
                          <td className="px-4 py-3 text-slate-500 italic">
                            {row.ejemplo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-amber-600">
                      {" "}
                      <IoWarningOutline size={20} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-amber-800">
                        Importante antes de subir el CSV
                      </h4>

                      <ul className="mt-2 space-y-1 text-sm text-amber-700 list-disc list-inside">
                        <li>
                          El archivo debe estar en formato{" "}
                          <span className="font-medium">CSV</span> y usar el
                          separador correcto.
                        </li>
                        <li>
                          Los campos deben respetar el{" "}
                          <span className="font-medium">orden indicado</span> en
                          la guía.
                        </li>
                        <li>
                          Los campos <span className="font-medium">Área</span> y{" "}
                          <span className="font-medium">Nivel</span> deben
                          coincidir con los valores permitidos. Consulta la guía
                          de áreas y niveles.
                        </li>
                        <li>
                          No se puede registrar más de un evaluador con el mismo{" "}
                          <span className="font-medium">
                            correo, CI o teléfono
                          </span>
                          .
                        </li>
                        <li>
                          No se puede registrar dos evaluadores en la{" "}
                          <span className="font-medium">
                            misma área y nivel
                          </span>
                          .
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => setShowGuideAreasNiveles(true)}
                  >
                    <span>
                      <RiInformationLine className="h-5 w-5 text-white" />
                    </span>
                    Ver guía de areas y niveles
                  </Button>
                </div>
              </div>
              <ModalAreasNiveles
                open={showGuideAreasNiveles}
                onClose={() => setShowGuideAreasNiveles(false)}
              />
              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setShowGuide(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
