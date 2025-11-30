import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiDownload, FiSearch, FiUser, FiEye, FiX } from "react-icons/fi";
import { MdCheckCircle, MdCancel, MdWarning } from "react-icons/md";
import { TbMedal, TbAward } from "react-icons/tb";

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("clasificatoria");
  const [areaFilter, setAreaFilter] = useState("all");
  const [nivelFilter, setNivelFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState("pdf"); // 'pdf' o 'excel'

  // ... (tus mock data y funciones de filtrado aquí, sin cambios)

  // Datos simulados (igual que antes)
  const mockClasificatoria = [
    { id: 1, name: "Ana María Rodríguez", area: "Matemáticas", nivel: "Primaria", score: 85, status: "clasificado" },
    { id: 2, name: "Carlos Pérez López", area: "Física", nivel: "Secundaria", score: 92, status: "clasificado" },
    { id: 3, name: "María González", area: "Química", nivel: "Secundaria", score: 78, status: "clasificado" },
    { id: 4, name: "Juan Mamoní", area: "Informática", nivel: "Universitario", score: 65, status: "no_clasificado" },
    { id: 5, name: "Sofía Quispe", area: "Biología", nivel: "Primaria", score: 45, status: "descalificado" },
    { id: 6, name: "Luis Torrez", area: "Astronomía", nivel: "Secundaria", score: 88, status: "clasificado" },
  ];

  const mockFinal = [
    { id: 2, rank: 1, name: "Carlos Pérez López", area: "Física", nivel: "Secundaria", score: 95, award: "oro", certificateStatus: "generated" },
    { id: 6, rank: 2, name: "Luis Torrez", area: "Astronomía", nivel: "Secundaria", score: 91, award: "plata", certificateStatus: "generated" },
    { id: 1, rank: 3, name: "Ana María Rodríguez", area: "Matemáticas", nivel: "Primaria", score: 87, award: "bronce", certificateStatus: "generated" },
    { id: 3, rank: 4, name: "María González", area: "Química", nivel: "Secundaria", score: 82, award: "mencion", certificateStatus: "pending" },
  ];

  // Filtrado (igual que antes)
  const filteredClasificatoria = mockClasificatoria.filter(item => {
    const matchesArea = areaFilter === "all" || item.area === areaFilter;
    const matchesNivel = nivelFilter === "all" || item.nivel === nivelFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesNivel && matchesSearch;
  });

  const filteredFinal = mockFinal.filter(item => {
    const matchesArea = areaFilter === "all" || item.area === areaFilter;
    const matchesNivel = nivelFilter === "all" || item.nivel === nivelFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesNivel && matchesSearch;
  });

  // Funciones de iconos y colores (igual que antes)
  const getStatusIcon = (status) => {
    switch (status) {
      case "clasificado": return <MdCheckCircle className="text-green-500" />;
      case "no_clasificado": return <MdCancel className="text-red-500" />;
      case "descalificado": return <MdWarning className="text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "clasificado": return "bg-green-100 text-green-800";
      case "no_clasificado": return "bg-red-100 text-red-800";
      case "descalificado": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAwardIcon = (award) => {
    switch (award) {
      case "oro": return <TbMedal className="text-yellow-500" />;
      case "plata": return <TbMedal className="text-gray-500" />;
      case "bronce": return <TbMedal className="text-orange-500" />;
      case "mencion": return <TbAward className="text-blue-500" />;
      default: return null;
    }
  };

  const getAwardLabel = (award) => {
    switch (award) {
      case "oro": return "Oro";
      case "plata": return "Plata";
      case "bronce": return "Bronce";
      case "mencion": return "Mención Honorífica";
      default: return "";
    }
  };

  const getAwardColor = (award) => {
    switch (award) {
      case "oro": return "bg-yellow-100 text-yellow-800";
      case "plata": return "bg-gray-100 text-gray-800";
      case "bronce": return "bg-orange-100 text-orange-800";
      case "mencion": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCertificateButton = (status, competitorId) => {
    if (status === "generated") {
      return (
        <button
          onClick={() => alert(`Certificado generado para competidor ${competitorId}`)}
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
    const data = isClasificatoria ? filteredClasificatoria : filteredFinal;

    return (
      <div className={`max-w-5xl mx-auto p-6 ${previewType === 'pdf' ? 'bg-white shadow-lg' : 'bg-gray-50'}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-ink">Resultados de las Olimpiadas Científicas</h2>
          <p className="text-ink/70">{isClasificatoria ? 'Fase Clasificatoria' : 'Fase Final'}</p>
          <p className="text-sm text-ink/50 mt-2">
            Generado el {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className={`overflow-x-auto ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>
          <table className={`w-full ${previewType === 'excel' ? 'border-collapse' : 'border-separate'}`}>
            <thead>
              <tr>
                {isClasificatoria ? (
                  <>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Nombre</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Área</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Nivel</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Puntaje</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Estado</th>
                  </>
                ) : (
                  <>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Rank</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Nombre</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Área/Nivel</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Puntaje</th>
                    <th className={`p-3 text-left font-semibold ${previewType === 'excel' ? 'border border-gray-300 bg-gray-100' : 'bg-slate-50'}`}>Premio</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id}>
                  {isClasificatoria ? (
                    <>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.name}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.area}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.nivel}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.score}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status === "clasificado" && "Clasificado"}
                          {item.status === "no_clasificado" && "No Clasificado"}
                          {item.status === "descalificado" && "Descalificado"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>
                        <span className="font-bold">{item.rank}º</span>
                      </td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.name}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>
                        {item.area}<br /><span className="text-xs text-ink/60">{item.nivel}</span>
                      </td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>{item.score}</td>
                      <td className={`p-3 ${previewType === 'excel' ? 'border border-gray-300' : ''}`}>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getAwardColor(item.award)}`}>
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
          Documento oficial generado por el Comité de Olimpiadas Científicas — Universidad Mayor de San Simón
        </div>
      </div>
    );
  };

  const handleDownload = () => {
    alert(`Descargando en formato ${downloadFormat.toUpperCase()}...`);
    // Aquí irá la llamada a la API más tarde
  };

  return (
    <div className="min-h-screen bg-[#f9fbfb] font-comfortaa">
      <Navbar onLoginClick={() => setIsAuthenticated(true)} />

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
              onClick={() => window.location.href = "/"}
              className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        <p className="text-ink/70 mb-6">
          Consulta los resultados oficiales. Puedes filtrar o ver tu resultado personal si estás autenticado.
        </p>

        {/* Filtros y Descargas */}
<div className="bg-white rounded-xl shadow-soft p-4 mb-6">
  <h2 className="font-semibold mb-3 flex items-center gap-1">
    <FiSearch size={18} /> Filtros y Descargas
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Área */}
    <div>
      <label className="block text-sm font-medium text-ink mb-1">Área</label>
      <select
        value={areaFilter}
        onChange={(e) => setAreaFilter(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Todas las áreas</option>
        <option value="Matemáticas">Matemáticas</option>
        <option value="Física">Física</option>
        <option value="Química">Química</option>
        <option value="Biología">Biología</option>
        <option value="Informática">Informática</option>
        <option value="Astronomía">Astronomía</option>
      </select>
    </div>

    {/* Nivel */}
    <div>
      <label className="block text-sm font-medium text-ink mb-1">Nivel</label>
      <select
        value={nivelFilter}
        onChange={(e) => setNivelFilter(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Todos los niveles</option>
        <option value="Primaria">Primaria</option>
        <option value="Secundaria">Secundaria</option>
        <option value="Universitario">Universitario</option>
      </select>
    </div>

    {/* Buscar */}
    <div>
      <label className="block text-sm font-medium text-ink mb-1">Buscar</label>
      <input
        type="text"
        placeholder="Nombre del competidor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Dropdown + Vista Previa + Descargar */}
    <div>
      <label className="block text-sm font-medium text-ink mb-1">Formato</label>
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
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          title={`Vista previa en ${downloadFormat.toUpperCase()}`}
        >
          <FiEye size={18} />
        </button>

        {/* Botón de Descargar */}
        <button
          onClick={handleDownload}
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
              onClick={() => setActiveTab("clasificatoria")}
              className={`pb-3 font-medium text-lg ${activeTab === "clasificatoria" ? "border-b-2 border-blue-600 text-blue-600" : "text-ink/70"}`}
            >
              Fase Clasificatoria
            </button>
            <button
              onClick={() => setActiveTab("final")}
              className={`pb-3 font-medium text-lg ${activeTab === "final" ? "border-b-2 border-blue-600 text-blue-600" : "text-ink/70"}`}
            >
              Fase Final
            </button>
          </div>
        </div>

        {/* Tablas (igual que antes, puedes mantener tu código) */}
        {activeTab === "clasificatoria" && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Resultados Fase Clasificatoria</h2>
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
                  {filteredClasificatoria.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.area}</td>
                      <td className="px-4 py-3">{item.nivel}</td>
                      <td className="px-4 py-3">{item.score} pts</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status === "clasificado" && "Clasificado"}
                          {item.status === "no_clasificado" && "No Clasificado"}
                          {item.status === "descalificado" && "Descalificado"}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                    <th className="px-4 py-3 text-left">Certificado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredFinal.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-bold">{item.rank}º</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">
                        {item.area}<br /><span className="text-xs text-ink/60">{item.nivel}</span>
                      </td>
                      <td className="px-4 py-3">{item.score} pts</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getAwardColor(item.award)}`}>
                          {getAwardIcon(item.award)} {getAwardLabel(item.award)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getCertificateButton(item.certificateStatus, item.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div className="p-4">
              {renderPreviewTable()}
            </div>
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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