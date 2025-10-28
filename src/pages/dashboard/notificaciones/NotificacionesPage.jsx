// src/pages/dashboard/notificaciones/NotificacionesPage.jsx
import {
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Eye,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import StatusBadge from "./components/StatusBadge";
import DetailsModal from "./components/DetailsModal";
import { useNotificaciones } from "./hooks/useNotificaciones";

const ROLES = ["Todos los roles", "Evaluador", "Responsable"];
const ESTADOS = [
  "Todos los estados",
  "Confirmado",
  "Pendiente",
  "Rebotado",
];

const fmtDate = (iso) =>
  new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function NotificacionesPage() {
  const { query, setQuery, rol, setRol, estado, setEstado, rows, kpis } =
    useNotificaciones();

  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Encabezado local (NO usar Header global) */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">
            Notificaciones de acceso
          </h1>
          <p className="text-gray-600 mt-2">
            Administre los correos de invitación y acceso enviados a los
            usuarios del sistema.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => alert("Simulación: reenviar enlaces a los seleccionados")}
        >
          <RefreshCcw size={18} />
          Reenviar enlaces
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-6 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Total de notificaciones</p>
            <Mail className="text-blue-600" size={22} />
          </div>
          <p className="mt-4 text-5xl font-semibold text-sky-600">{kpis.total}</p>
        </div>

        <div className="rounded-2xl border p-6 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Enviadas correctamente</p>
            <CheckCircle2 className="text-green-600" size={22} />
          </div>
          <p className="mt-4 text-5xl font-semibold text-green-600">
            {kpis.enviadasOK}
          </p>
        </div>

        <div className="rounded-2xl border p-6 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Fallidas o rebotadas</p>
            <XCircle className="text-red-600" size={22} />
          </div>
          <p className="mt-4 text-5xl font-semibold text-red-600">
            {kpis.rebotadas}
          </p>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="rounded-2xl border bg-white">
        <div className="px-5 pt-6">
          <h2 className="text-3xl font-semibold text-gray-900">
            Lista de notificaciones enviadas
          </h2>
          <p className="text-gray-600 mt-1">
            Historial completo de correos de invitación enviados
          </p>
        </div>

        {/* Controles: búsqueda + filtros (selects nativos) */}
        <div className="px-5 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, correo"
              className="w-80 pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Rol */}
            <div className="relative">
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="appearance-none w-48 pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* Estado */}
            <div className="relative">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="appearance-none w-56 pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-3 pl-5">Usuario</th>
                <th className="py-3">Correo</th>
                <th className="py-3">Rol</th>
                <th className="py-3">Estado</th>
                <th className="py-3">Fecha de envío</th>
                <th className="py-3">Confirmado</th>
                <th className="py-3 pr-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="text-sm text-gray-800">
                  <td className="py-3 pl-5">{r.usuario}</td>
                  <td className="py-3">{r.correo}</td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                      {r.rol}
                    </span>
                  </td>
                  <td className="py-3">
                    <StatusBadge value={r.estado} />
                  </td>
                  <td className="py-3">{fmtDate(r.fechaEnvio)}</td>
                  <td className="py-3">
                    {r.confirmado ? (
                      <span className="inline-flex items-center gap-2 text-green-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <button
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                      onClick={() => {
                        setFocus(r);
                        setOpen(true);
                      }}
                    >
                      <Eye size={16} />
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    No hay resultados para el criterio seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailsModal open={open} onClose={() => setOpen(false)} item={focus} />
    </div>
  );
}
