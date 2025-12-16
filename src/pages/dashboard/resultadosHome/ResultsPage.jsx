import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiDownload, FiSearch, FiUser, FiEye, FiX } from "react-icons/fi";
import { MdCheckCircle, MdCancel, MdWarning } from "react-icons/md";
import { TbMedal, TbAward } from "react-icons/tb";
import { useFiltersResult } from "./hooks/useFilterResult";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/features/auth/components/LoginModal";

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("clasificatoria");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState("pdf"); // 'pdf' o 'excel'
  const Navigate = useNavigate();
  // ... (tus mock data y funciones de filtrado aquí, sin cambios)

  const { dataAreas, data, lastPage, loading, filtros, setters, opciones } =
    useFiltersResult();
  // Datos simulados (igual que antes)
  const handleDownloadExcel = async () => {
    try {
      const selectedArea = dataAreas.find((a) => a.nombre === filtros.area);
      const selectedNivel = selectedArea?.niveles.find(
        (n) => n.nombre_nivel === filtros.nivel
      );
      const orden = filtros.fase.nombre == "final" ? "puntaje_total" : "nombre";
      const direccion = filtros.fase.nombre == "final" ? "desc" : "asc";
      const params = {
        esPublicado: true,
        ordenar_por: orden,
        direccion: direccion,
        busqueda: filtros.query,
        id_fase: filtros.fase.id,
        id_area: selectedArea?.id || null,
        id_nivel: selectedNivel?.id || null,
      };
      console.log("payload", params);
      console.log(params);
      const response = await api.get("evaluaciones/exportar", {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `resultados_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", "_")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      alert("Hubo un problema al exportar las evaluaciones.");
    }
  };

  const handleExportarPDF = async () => {
    try {
      const selectedArea = dataAreas.find((a) => a.nombre === filtros.area);
      const selectedNivel = selectedArea?.niveles.find(
        (n) => n.nombre_nivel === filtros.nivel
      );
      const orden = filtros.fase.nombre == "final" ? "puntaje_total" : "nombre";
      const direccion = filtros.fase.nombre == "final" ? "desc" : "asc";
      const params = {
        esPublicado: true,
        ordenar_por: orden,
        direccion: direccion,
        busqueda: filtros.query,
        id_fase: filtros.fase.id,
        id_area: selectedArea?.id || null,
        id_nivel: selectedNivel?.id || null,
      };
      const response = await api.get("/exportar-evaluaciones-pdf", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "evaluaciones_filtradas.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };
  // Funciones de iconos y colores (igual que antes)
  const getStatusIcon = (status) => {
    switch (status) {
      case "Clasificado":
        return <MdCheckCircle className="text-green-500" />;
      case "No clasificado":
        return <MdCancel className="text-red-500" />;
      case "Descalificado":
        return <MdWarning className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Clasificado":
        return "bg-green-100 text-green-800";
      case "No clasificado":
        return "bg-red-100 text-red-800";
      case "Descalificado":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAwardIcon = (award) => {
    switch (award) {
      case "Oro":
        return <TbMedal size={20} className="text-yellow-500" />;
      case "Plata":
        return <TbMedal size={20} className="text-gray-500" />;
      case "Bronce":
        return <TbMedal size={20} className="text-orange-500" />;
      case "Mención Honorífica":
        return <TbAward size={20} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getAwardLabel = (award) => {
    switch (award) {
      case "Oro":
        return "Oro";
      case "Plata":
        return "Plata";
      case "Bronce":
        return "Bronce";
      case "Mención Honorífica":
        return "Mención Honorífica";
      default:
        return "";
    }
  };

  const getAwardColor = (award) => {
    switch (award) {
      case "Oro":
        return "bg-yellow-100 text-yellow-800";
      case "Plata":
        return "bg-gray-100 text-gray-800";
      case "Bronce":
        return "bg-orange-100 text-orange-800";
      case "Mención Honorífica":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCertificateButton = (status, competitorId) => {
    if (status === "generated") {
      return (
        <button
          onClick={() =>
            alert(`Certificado generado para competidor ${competitorId}`)
          }
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ver certificado
        </button>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md">
          Pendiente
        </span>
      );
    }
  };

  // === NUEVO: Renderizado de vista previa ===
  const renderPreviewTable = () => {
    const isClasificatoria = activeTab === "clasificatoria";

    return (
      <div
        className={`max-w-5xl mx-auto p-6 ${
          previewType === "pdf" ? "bg-white shadow-lg" : "bg-gray-50"
        }`}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-ink">
            Resultados de las Olimpiadas Científicas
          </h2>
          <p className="text-ink/70">
            {isClasificatoria ? "Fase Clasificatoria" : "Fase Final"}
          </p>
          <p className="text-sm text-ink/50 mt-2">
            Generado el {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <div
          className={`overflow-x-auto ${
            previewType === "excel" ? "border border-gray-300" : ""
          }`}
        >
          <table
            className={`w-full ${
              previewType === "excel" ? "border-collapse" : "border-separate"
            }`}
          >
            <thead>
              <tr>
                {isClasificatoria ? (
                  <>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Nombre
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Área
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Nivel
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Puntaje
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Estado
                    </th>
                  </>
                ) : (
                  <>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Rank
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Nombre
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Área/Nivel
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Puntaje
                    </th>
                    <th
                      className={`p-3 text-left font-semibold ${
                        previewType === "excel"
                          ? "border border-gray-300 bg-gray-100"
                          : "bg-slate-50"
                      }`}
                    >
                      Premio
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, idx) => (
                <tr key={item.id}>
                  {isClasificatoria ? (
                    <>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.name}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.area}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.nivel}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.score}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        <span className="font-bold">{item.rank}º</span>
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.name}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.area}
                        <br />
                        <span className="text-xs text-ink/60">
                          {item.nivel}
                        </span>
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        {item.score}
                      </td>
                      <td
                        className={`p-3 ${
                          previewType === "excel"
                            ? "border border-gray-300"
                            : ""
                        }`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getAwardColor(
                            item.award
                          )}`}
                        >
                          {getAwardIcon(item.award)} {getAwardLabel(item.award)}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-xs text-ink/40">
          Documento oficial generado por el Comité de Olimpiadas Científicas —
          Universidad Mayor de San Simón
        </div>
      </div>
    );
  };

  const handleDownload = () => {
    alert(`Descargando en formato ${downloadFormat.toUpperCase()}...`);
    // Aquí irá la llamada a la API más tarde
  };

  return (
    <div className="h-screen bg-[#f9fbfb] font-comfortaa">
      <Navbar onLoginClick={() => setOpen(true)} />
      <LoginModal open={open} onClose={() => setOpen(false)} />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-ink">Resultados Oficiales</h1>
          <div className="flex gap-2">
            {isAuthenticated && (
              <button
                onClick={() => alert("Mostrando tu resultado personal...")}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-100"
              >
                <FiUser size={16} /> Ver mi resultado
              </button>
            )}
            <button
              onClick={() => {
                Navigate("/");
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        <p className="text-ink/70 mb-6">
          Consulta los resultados oficiales. Puedes filtrar o ver tu resultado
          personal si estás autenticado.
        </p>

        {/* Filtros y Descargas */}
        <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-1">
            <FiSearch size={18} /> Filtros y Descargas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Área
              </label>
              <select
                value={filtros.area}
                onChange={(e) => setters.setArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {opciones.areasDisponibles.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Nivel
              </label>
              <select
                value={filtros.nivel}
                onChange={(e) => setters.setNivel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {opciones.nivelesDisponibles.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Buscar */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nombre del competidor..."
                value={filtros.query}
                onChange={(e) => setters.setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown + Vista Previa + Descargar */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Formato
              </label>
              <div className="flex items-center gap-2">
                {/* Dropdown de formato */}
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>

                {/* Botón de Vista Previa con ícono de ojo */}
                <button
                  onClick={() => {
                    setPreviewType(downloadFormat);
                    setPreviewOpen(true);
                  }}
                  className="p-2 bg-[#0284C7] text-white hover:bg-[#027AB6] active:bg-[#026BA1] rounded-md  transition"
                  title={`Vista previa en ${downloadFormat.toUpperCase()}`}
                >
                  <FiEye size={18} />
                </button>

                {/* Botón de Descargar */}
                <button
                  onClick={() => {
                    if (downloadFormat === "pdf") handleExportarPDF();
                    if (downloadFormat === "excel") handleDownloadExcel();
                  }}
                  className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  title={`Descargar en ${downloadFormat.toUpperCase()}`}
                >
                  <FiDownload size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas y tablas (igual que antes) */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("clasificatoria");
                const fs = opciones.fases.find(
                  (f) => f.nombre === "clasificacion"
                );
                setters.setFase(fs);
              }}
              className={`pb-3 font-medium text-lg ${
                activeTab === "clasificatoria"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-ink/70"
              }`}
            >
              Fase Clasificatoria
            </button>
            <button
              onClick={() => {
                setActiveTab("final");
                const fs = opciones.fases.find((f) => f.nombre === "final");
                setters.setFase(fs);
              }}
              className={`pb-3 font-medium text-lg ${
                activeTab === "final"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-ink/70"
              }`}
            >
              Fase Final
            </button>
          </div>
        </div>

        {/* Tablas (igual que antes, puedes mantener tu código) */}
        {activeTab === "clasificatoria" && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold">
                Resultados Fase Clasificatoria
              </h2>
              <p className="text-ink/70 mt-1">Estados de clasificación</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Área</th>
                    <th className="px-4 py-3 text-left">Nivel</th>
                    <th className="px-4 py-3 text-left">Puntaje</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading || !data ? (
                    <tr>
                      <td className="p-4 text-ink/60" colSpan={5}>
                        Sin datos.
                      </td>
                    </tr>
                  ) : data.length == 0 ? (
                    <tr>
                      <td className="p-4 text-ink/60" colSpan={5}>
                        Sin datos.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.area}</td>
                        <td className="px-4 py-3">{item.nivel}</td>
                        <td className="px-4 py-3">{item.score} pts</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusIcon(item.status)}
                            {item.status === "Clasificado" && "Clasificado"}
                            {item.status === "No clasificado" &&
                              "No clasificado"}
                            {item.status === "Descalificado" && "Descalificado"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "final" && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Resultados Fase Final</h2>
              <p className="text-ink/70 mt-1">Ranking con premiaciones</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Área/Nivel</th>
                    <th className="px-4 py-3 text-left">Puntaje</th>
                    <th className="px-4 py-3 text-left">Premio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading || !data ? (
                    <tr>
                      <td className="p-4 text-ink/60" colSpan={5}>
                        Sin datos.
                      </td>
                    </tr>
                  ) : data.length == 0 ? (
                    <tr>
                      <td className="p-4 text-ink/60" colSpan={5}>
                        Sin datos.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-bold">{item.rank}º</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">
                          {item.area}
                          <br />
                          <span className="text-xs text-ink/60">
                            {item.nivel}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.score} pts</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getAwardColor(
                              item.award
                            )}`}
                          >
                            {getAwardIcon(item.award)}{" "}
                            {getAwardLabel(item.award)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {data?.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setters.setPage(filtros.page - 1)}
              disabled={filtros.page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {filtros.page} de {lastPage}
            </span>
            <button
              onClick={() => setters.setPage(filtros.page + 1)}
              disabled={filtros.page === lastPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      {/* === MODAL DE VISTA PREVIA === */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto relative">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Vista Previa del Documento</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">{renderPreviewTable()}</div>
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-[#0284C7] text-white hover:bg-[#027AB6] active:bg-[#026BA1] rounded-md "
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
