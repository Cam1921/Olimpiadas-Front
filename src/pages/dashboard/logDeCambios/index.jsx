// src/pages/dashboard/logDeCambios/index.jsx
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
  FiClock,
} from "react-icons/fi";
import useFiltros from "./hooks/useFiltros";
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository";
import api from "@/lib/api";

/* ---------------------------
  MOCK DATA (usa tu propio backend luego)
----------------------------*/
const mockLogEntries = [
  {
    id: "LOG-000123",
    fecha: "2025-12-05",
    hora: "14:32",
    competidor: "Juan Pérez García",
    area: "Matemáticas",
    nivel: "Primer Nivel",
    fase: "Clasificación",
    notaAntes: "78.50",
    notaDespues: "81.25",
    usuario: "María González",
    rol: "Evaluador",
    tipoAccion: "Actualización",
    motivo: "Corrección de error en suma de puntos parciales",
  },
  {
    id: "LOG-000124",
    fecha: "2025-12-05",
    hora: "14:28",
    competidor: "Ana Rodríguez López",
    area: "Física",
    nivel: "4S",
    fase: "Final",
    notaAntes: null,
    notaDespues: "92.00",
    usuario: "Carlos Quispe",
    rol: "Evaluador",
    tipoAccion: "Inserción",
    motivo: "Registro inicial de nota",
  },
  {
    id: "LOG-000125",
    fecha: "2025-12-05",
    hora: "14:15",
    competidor: "Luis Mamani Choque",
    area: "Química",
    nivel: "2S",
    fase: "Clasificación",
    notaAntes: "65.00",
    notaDespues: null,
    usuario: "Ana Rodríguez",
    rol: "Responsable",
    tipoAccion: "Eliminación",
    motivo: "Competidor descalificado por incumplimiento de normas",
  },
  {
    id: "LOG-000126",
    fecha: "2025-12-05",
    hora: "13:45",
    competidor: "María Quispe Torres",
    area: "Biología",
    nivel: "4S",
    fase: "Final",
    notaAntes: "88.50",
    notaDespues: "90.75",
    usuario: "Luis Mamani",
    rol: "Responsable",
    tipoAccion: "Actualización",
    motivo: "Revisión solicitada por reclamo del competidor",
  },
  {
    id: "LOG-000127",
    fecha: "2025-12-05",
    hora: "13:30",
    competidor: "Pedro Sánchez Morales",
    area: "Matemáticas",
    nivel: "Cuarto Nivel",
    fase: "Clasificación",
    notaAntes: null,
    notaDespues: "75.50",
    usuario: "María González",
    rol: "Evaluador",
    tipoAccion: "Inserción",
    motivo: "Registro inicial de nota",
  },
  {
    id: "LOG-000128",
    fecha: "2025-12-04",
    hora: "16:20",
    competidor: "Sofía Mamani Cruz",
    area: "Robótica",
    nivel: "Builders P",
    fase: "Clasificación",
    notaAntes: "70.00",
    notaDespues: "73.50",
    usuario: "Carlos Quispe",
    rol: "Evaluador",
    tipoAccion: "Actualización",
    motivo: "Ajuste por criterio de evaluación no aplicado correctamente",
  },
  {
    id: "LOG-000129",
    fecha: "2025-12-04",
    hora: "15:45",
    competidor: "Diego Flores Arias",
    area: "Informática",
    nivel: "Guanaco",
    fase: "Clasificación",
    notaAntes: "80.00",
    notaDespues: null,
    usuario: "Ana Rodríguez",
    rol: "Responsable",
    tipoAccion: "Eliminación",
    motivo: "Duplicación de registro - nota incorrecta",
  },
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
    "6S — 6to Secundaria",
  ],
  Biología: [
    "2S — 2do Secundaria",
    "3S — 3ro Secundaria",
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria",
  ],
  Física: ["4S — 4to Secundaria", "5S — 5to Secundaria", "6S — 6to Secundaria"],
  Informática: [
    "Guacamayo — 5to a 6to Primaria",
    "Guanaco — 1ro a 3ro Secundaria",
    "Londra — 1ro a 3ro Secundaria",
    "Bufeo — 1ro a 3ro Secundaria",
    "Jucumari — 4to a 6to Secundaria",
    "Puma — 4to a 6to Secundaria",
  ],
  Matemáticas: [
    "Primer Nivel — 1ro Secundaria",
    "Segundo Nivel — 2do Secundaria",
    "Tercer Nivel — 3ro Secundaria",
    "Cuarto Nivel — 4to Secundaria",
    "Quinto Nivel — 5to Secundaria",
    "Sexto Nivel — 6to Secundaria",
  ],
  Química: [
    "2S — 2do Secundaria",
    "3S — 3ro Secundaria",
    "4S — 4to Secundaria",
    "5S — 5to Secundaria",
    "6S — 6to Secundaria",
  ],
  Robótica: [
    "Builders P — 5to a 6to Primaria",
    "Lego P — 5to a 6to Primaria",
    "Builders S — 1ro a 6to Secundaria",
    "Lego S — 1ro a 6to Secundaria",
  ],
};

// auxiliares
const areas = ["Todas", ...Object.keys(areaLevels)];

function getAllLevelsUnion() {
  const all = new Set();
  Object.values(areaLevels).forEach((arr) => arr.forEach((l) => all.add(l)));
  return ["Todos", ...Array.from(all)];
}

/* helper para estilos de chips de tipoAccion */
function tipoAccionClasses(tipo) {
  if (tipo === "Inserción") return "bg-blue-100 text-blue-800 border-blue-200";
  if (tipo === "Actualización")
    return "bg-green-100 text-green-800 border-green-200";
  if (tipo === "Eliminación") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

/* Custom input for react-datepicker to match a button (uses forwardRef required) */
const DateButton = forwardRef(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className="w-full flex items-center gap-2 justify-start px-3 py-2 border rounded bg-white text-sm"
    type="button"
  >
    <FiCalendar className="text-gray-600" />
    <span className="text-sm text-gray-700">
      {value || "Seleccionar fecha"}
    </span>
  </button>
));

export default function TrazabilidadLogPage() {
  const [logs] = useState(mockLogEntries);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filtros, setters, opciones, lastPage, info, limpiarFiltros, data } =
    useFiltros();

  console.log(filtros, setters, opciones);
  console.log(data);

  const handleVerDetalle = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  /* const handleExport = (fmt) => {
    console.info("Exportando");
    // Placeholder: you will call backend /logs/export? or build CSV on client
  }; */
  const handleExpor = async () => {
    try {
      const params = {
        id_area: filtros.filtroArea,
        id_nivel: filtros.filtroNivel,
        id_rol: filtros.filtroRol,
        id_fase: filtros.filtroFase,
        fecha: filtros.selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : undefined,
      };
      console.log(params);
      const response = await api.get("/logs/evaluaciones/export", {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `logs_evaluaciones_${new Date()
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

  const filteredLogs = logs;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">
          Trazabilidad y Log de Cambios
        </h2>
        <p className="text-sm text-gray-500">
          Registro completo de modificaciones de notas con trazabilidad
          garantizada
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Registros hoy</div>
            <FiCalendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 text-2xl font-bold text-primary">
            {" "}
            {info.registros_hoy || 0}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Inserciones</div>
            <FiPlusCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">
              {" "}
              {info.total_insert || 0}
            </div>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              insert
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Actualizaciones</div>
            <FiRefreshCw className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">
              {info.total_update || 0}
            </div>
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
              update
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <select
            className="p-2 border rounded"
            value={filtros.filtroArea || ""}
            onChange={(e) => {
              setters.setFiltroArea(e.target.value || null);
            }}
          >
            {/* label descriptiva en vez de "Todas" */}
            <option value=" ">Área</option>
            {opciones.areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filtros.filtroNivel}
            onChange={(e) => setters.setFiltroNivel(e.target.value)}
          >
            {/* label descriptiva en vez de "Todos" */}
            <option value=" ">Nivel</option>
            {opciones.niveles.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filtros.filtroFase}
            onChange={(e) => setters.setFiltroFase(e.target.value)}
          >
            {/* label descriptiva en vez de "Todas" */}
            <option value=" ">Fase</option>
            {opciones.fases.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filtros.filtroRol}
            onChange={(e) => setters.setFiltroRol(e.target.value)}
          >
            {/* label descriptiva en vez de "Todos" */}
            <option value=" ">Rol</option>
            {opciones.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filtros.filtroAccion}
            onChange={(e) => setters.setFiltroAccion(e.target.value)}
          >
            {/* label descriptiva en vez de "Todos" */}
            <option value=" ">Accion</option>
            {opciones.acciones.map((i, r) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <div>
            {/* react-datepicker usando un CustomInput (DateButton) */}
            <DatePicker
              selected={filtros.selectedDate}
              onChange={(date) => setters.setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              locale={es}
              customInput={<DateButton />}
              placeholderText="Seleccionar fecha"
              isClearable
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={limpiarFiltros}
            className="px-3 py-1 border rounded text-sm flex items-center gap-2"
          >
            <FiRefreshCw /> Limpiar filtros
          </button>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExpor()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-2"
            >
              <FiDownload /> Exportar Excel
            </button>
            {/* CSV eliminado por petición */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs text-gray-600">
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
            {data.length === 0 ? (
              <tr>
                <td colSpan="12" className="py-8 text-center text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              data.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-500" />
                      <div>
                        <div>
                          {format(
                            new Date(log.fecha + "T00:00:00"),
                            "dd/MM/yyyy"
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{log.hora}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">{log.competidor}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {log.area}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {log.nivel}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 border rounded text-xs">
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
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {log.rol}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 border rounded text-xs ${tipoAccionClasses(
                        log.tipoAccion
                      )}`}
                    >
                      {log.tipoAccion}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2 max-w-xs truncate"
                    title={log.motivo}
                  >
                    {log.motivo}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleVerDetalle(log)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <FiEye className="w-5 h-5 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      {/* Detail modal (componente separado) */}
      <DetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
