import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailModal from "./DetailModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  FiCalendar,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiPlusCircle,
  FiTrash2,
  FiClock
} from "react-icons/fi";

/* ---------------------------
  MOCK DATA (usa tu propio backend luego)
----------------------------*/
const mockLogEntries = [
  { id: "LOG-000123", fecha: "2025-12-05", hora: "14:32", competidor: "Juan Pérez García", area: "Matemáticas", nivel: "Primer Nivel", fase: "Clasificación", notaAntes: "78.50", notaDespues: "81.25", usuario: "María González", rol: "Evaluador", tipoAccion: "Actualización", motivo: "Corrección de error en suma de puntos parciales" },
  { id: "LOG-000124", fecha: "2025-12-05", hora: "14:28", competidor: "Ana Rodríguez López", area: "Física", nivel: "4S", fase: "Final", notaAntes: null, notaDespues: "92.00", usuario: "Carlos Quispe", rol: "Evaluador", tipoAccion: "Inserción", motivo: "Registro inicial de nota" },
  { id: "LOG-000125", fecha: "2025-12-05", hora: "14:15", competidor: "Luis Mamani Choque", area: "Química", nivel: "2S", fase: "Clasificación", notaAntes: "65.00", notaDespues: null, usuario: "Ana Rodríguez", rol: "Responsable", tipoAccion: "Eliminación", motivo: "Competidor descalificado por incumplimiento de normas" },
  { id: "LOG-000126", fecha: "2025-12-05", hora: "13:45", competidor: "María Quispe Torres", area: "Biología", nivel: "4S", fase: "Final", notaAntes: "88.50", notaDespues: "90.75", usuario: "Luis Mamani", rol: "Responsable", tipoAccion: "Actualización", motivo: "Revisión solicitada por reclamo del competidor" },
  { id: "LOG-000127", fecha: "2025-12-05", hora: "13:30", competidor: "Pedro Sánchez Morales", area: "Matemáticas", nivel: "Cuarto Nivel", fase: "Clasificación", notaAntes: null, notaDespues: "75.50", usuario: "María González", rol: "Evaluador", tipoAccion: "Inserción", motivo: "Registro inicial de nota" },
  { id: "LOG-000128", fecha: "2025-12-04", hora: "16:20", competidor: "Sofía Mamani Cruz", area: "Robótica", nivel: "Builders P", fase: "Clasificación", notaAntes: "70.00", notaDespues: "73.50", usuario: "Carlos Quispe", rol: "Evaluador", tipoAccion: "Actualización", motivo: "Ajuste por criterio de evaluación no aplicado correctamente" },
  { id: "LOG-000129", fecha: "2025-12-04", hora: "15:45", competidor: "Diego Flores Arias", area: "Informática", nivel: "Guanaco", fase: "Clasificación", notaAntes: "80.00", notaDespues: null, usuario: "Ana Rodríguez", rol: "Responsable", tipoAccion: "Eliminación", motivo: "Duplicación de registro - nota incorrecta" }
];

/* ---------------------------
  AREAS y NIVELES oficiales (según tu lista)
----------------------------*/
const areaLevels = {
  "Astronomía – Astrofísica": [
    "3P — 3ro Primaria",
    "4P — 4to Primaria",
    "5P — 5to Primaria",
    "6P — 6to Primaria",
    "1S — 1ro Secundaria",
    "2S — 2do Secundaria",
    "3S — 3ro Secundaria",
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria"
  ],
  "Biología": [
    "2S — 2do Secundaria",
    "3S — 3ro Secundaria",
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria"
  ],
  "Física": [
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria"
  ],
  "Informática": [
    "Guacamayo — 5to a 6to Primaria",
    "Guanaco — 1ro a 3ro Secundaria",
    "Londra — 1ro a 3ro Secundaria",
    "Bufeo — 1ro a 3ro Secundaria",
    "Jucumari — 4to a 6to Secundaria",
    "Puma — 4to a 6to Secundaria"
  ],
  "Matemáticas": [
    "Primer Nivel — 1ro Secundaria",
    "Segundo Nivel — 2do Secundaria",
    "Tercer Nivel — 3ro Secundaria",
    "Cuarto Nivel — 4to Secundaria",
    "Quinto Nivel — 5to Secundaria",
    "Sexto Nivel — 6to Secundaria"
  ],
  "Química": [
    "2S — 2do Secundaria",
    "3S — 3ro Secundaria",
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria"
  ],
  "Robótica": [
    "Builders P — 5to a 6to Primaria",
    "Lego P — 5to a 6to Primaria",
    "Builders S — 1ro a 6to Secundaria",
    "Lego S — 1ro a 6to Secundaria"
  ]
};

// auxiliares
const areas = ["Todas", ...Object.keys(areaLevels)];

function getAllLevelsUnion() {
  const all = new Set();
  Object.values(areaLevels).forEach(arr => arr.forEach(l => all.add(l)));
  return ["Todos", ...Array.from(all)];
}

/* helper para estilos de chips de tipoAccion */
function tipoAccionClasses(tipo) {
  if (tipo === "Inserción") return "bg-blue-100 text-blue-800 border-blue-200";
  if (tipo === "Actualización") return "bg-green-100 text-green-800 border-green-200";
  if (tipo === "Eliminación") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

/* Custom input for react-datepicker to match a button (uses forwardRef required) */
const DateButton = forwardRef(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className="w-full flex items-center gap-2 justify-start px-3 py-2 border rounded bg-white text-xs sm:text-sm"
    type="button"
  >
    <FiCalendar className="text-gray-600" />
    <span className="text-xs sm:text-sm text-gray-700">{value || "Seleccionar fecha"}</span>
  </button>
));

export default function TrazabilidadLogPage() {
  const [logs] = useState(mockLogEntries);
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos"); // nivel depende de area
  const [filtroFase, setFiltroFase] = useState("Todas");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState(null); // store Date
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // niveles dinámicos según área seleccionada
  const nivelOptions = filtroArea === "Todas" ? getAllLevelsUnion() : ["Todos", ...areaLevels[filtroArea]];

  const handleVerDetalle = (log) => { setSelectedLog(log); setIsModalOpen(true); };
  const handleLimpiar = () => {
    setFiltroArea("Todas");
    setFiltroNivel("Todos");
    setFiltroFase("Todas");
    setFiltroRol("Todos");
    setFiltroTipo("Todos");
    setSelectedDate(null);
  };

  const handleExport = (fmt) => {
    const filtered = applyFilters();
    console.info("Exportando", fmt, filtered);
    // Placeholder: llamar a backend /logs/export?format=excel
  };

  const applyFilters = () => {
    return logs.filter(l => {
      if (filtroArea !== "Todas" && l.area !== filtroArea) return false;
      if (filtroNivel !== "Todos" && l.nivel !== filtroNivel) return false;
      if (filtroFase !== "Todas" && l.fase !== filtroFase) return false;
      if (filtroRol !== "Todos" && l.rol !== filtroRol) return false;
      if (filtroTipo !== "Todos" && l.tipoAccion !== filtroTipo) return false;
      if (selectedDate) {
        const sel = format(selectedDate, "yyyy-MM-dd");
        if (l.fecha !== sel) return false;
      }
      return true;
    });
  };

  const filteredLogs = applyFilters();
  const registrosHoy = logs.filter(l => l.fecha === format(new Date(), "yyyy-MM-dd")).length;
  const totalInserciones = logs.filter(l => l.tipoAccion === "Inserción").length;
  const totalActualizaciones = logs.filter(l => l.tipoAccion === "Actualización").length;
  const totalEliminaciones = logs.filter(l => l.tipoAccion === "Eliminación").length;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold">Trazabilidad y Log de Cambios</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Registro completo de modificaciones de notas con trazabilidad garantizada
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-3 md:p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500">Registros hoy</div>
            <FiCalendar className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <div className="mt-2 md:mt-3 text-xl md:text-2xl font-bold text-primary">{registrosHoy}</div>
        </div>

        <div className="p-3 md:p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500">Inserciones</div>
            <FiPlusCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <div className="mt-2 md:mt-3 flex items-center gap-2">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{totalInserciones}</div>
            <span className="px-2 py-0.5 text-[10px] md:text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              insert
            </span>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500">Actualizaciones</div>
            <FiRefreshCw className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          </div>
          <div className="mt-2 md:mt-3 flex items-center gap-2">
            <div className="text-xl md:text-2xl font-bold text-green-600">{totalActualizaciones}</div>
            <span className="px-2 py-0.5 text-[10px] md:text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
              update
            </span>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500">Eliminaciones</div>
            <FiTrash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
          </div>
          <div className="mt-2 md:mt-3 flex items-center gap-2">
            <div className="text-xl md:text-2xl font-bold text-red-600">{totalEliminaciones}</div>
            <span className="px-2 py-0.5 text-[10px] md:text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
              delete
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 md:p-4 rounded border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3">
          <select
            className="p-2 border rounded text-xs md:text-sm"
            value={filtroArea}
            onChange={e => { setFiltroArea(e.target.value); setFiltroNivel("Todos"); }}
          >
            <option value="Todas">Área</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select
            className="p-2 border rounded text-xs md:text-sm"
            value={filtroNivel}
            onChange={e => setFiltroNivel(e.target.value)}
          >
            <option value="Todos">Nivel</option>
            {nivelOptions.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <select
            className="p-2 border rounded text-xs md:text-sm"
            value={filtroFase}
            onChange={e => setFiltroFase(e.target.value)}
          >
            <option value="Todas">Fase</option>
            <option value="Clasificación">Clasificación</option>
            <option value="Final">Final</option>
          </select>

          <select
            className="p-2 border rounded text-xs md:text-sm"
            value={filtroRol}
            onChange={e => setFiltroRol(e.target.value)}
          >
            <option value="Todos">Tipo de rol</option>
            <option value="Evaluador">Evaluador</option>
            <option value="Responsable">Responsable</option>
          </select>

          <select
            className="p-2 border rounded text-xs md:text-sm"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Tipo de cambio</option>
            <option value="Inserción">Inserción</option>
            <option value="Actualización">Actualización</option>
            <option value="Eliminación">Eliminación</option>
          </select>

          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              locale={es}
              customInput={<DateButton />}
              placeholderText="Seleccionar fecha"
              isClearable
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleLimpiar}
            className="px-3 py-1 border rounded text-xs md:text-sm flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
          >
            <FiRefreshCw /> Limpiar filtros
          </button>

          <div className="sm:ml-auto flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs md:text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FiDownload /> Exportar Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-3 md:p-4 rounded border overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="text-left text-[11px] md:text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2">Fecha/Hora</th>
              <th className="px-3 py-2">Competidor</th>
              <th className="px-3 py-2">Área</th>
              <th className="px-3 py-2">Nivel</th>
              <th className="px-3 py-2">Fase</th>
              <th className="px-3 py-2">Nota antes</th>
              <th className="px-3 py-2">Nota después</th>
              <th className="px-3 py-2">Usuario que cambió</th>
              <th className="px-3 py-2">Tipo de rol</th>
              <th className="px-3 py-2">Tipo de cambio</th>
              <th className="px-3 py-2">Motivo</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="12" className="py-8 text-center text-gray-500 text-xs md:text-sm">
                  No se encontraron registros
                </td>
              </tr>
            ) : filteredLogs.map(log => (
              <tr key={log.id} className="border-t">
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-500 min-w-[14px]" />
                    <div>
                      <div>{format(new Date(log.fecha + "T00:00:00"), "dd/MM/yyyy")}</div>
                      <div className="text-[11px] md:text-xs text-gray-500">{log.hora}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">{log.competidor}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] md:text-xs">
                    {log.area}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] md:text-xs">
                    {log.nivel}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 border rounded text-[11px] md:text-xs">
                    {log.fase}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {log.notaAntes ? (
                    <code>{log.notaAntes}</code>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {log.notaDespues ? (
                    <code>{log.notaDespues}</code>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2">{log.usuario}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] md:text-xs">
                    {log.rol}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 border rounded text-[11px] md:text-xs ${tipoAccionClasses(log.tipoAccion)}`}>
                    {log.tipoAccion}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-xs truncate" title={log.motivo}>
                  {log.motivo}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleVerDetalle(log)}
                    className="p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                  >
                    <FiEye className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal (componente separado) */}
      <DetailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} log={selectedLog} />
    </div>
  );
}
