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
import api from "@/lib/api";
import SuccessDialog from "@/components/SuccessDialog"; // Asumo que este componente existe según tu código

const ROLES = ["Todos los roles", "Evaluador", "Responsable"];
const ESTADOS = ["Todos los estados", "Confirmado", "Pendiente", "Rebotado"];

const fmtDate = (iso) =>
  new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function NotificacionesPage() {
  const {
    query,
    setQuery,
    rol,
    setRol,
    estado,
    setEstado,
    rows,
    kpis,
    loading,
  } = useNotificaciones();

  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);
  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleForward(item) {
    if (!item) return;

    try {
      const { data } = await api.put(`/invitaciones/reenviar/${item.id}`);
      console.log(data);
      setOpen(false); // cierra el modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("No se pudo reenviar el correo ❌");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Notificaciones de acceso
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Administre los correos de invitación y acceso enviados a los
            usuarios del sistema.
          </p>
        </div>
      </div>

      {/* KPIs Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border p-5 sm:p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium text-sm sm:text-base">Total notificaciones</p>
            <Mail className="text-blue-600" size={22} />
          </div>
          <p className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-sky-600">
            {kpis.total}
          </p>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border p-5 sm:p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium text-sm sm:text-base">Confirmados</p>
            <CheckCircle2 className="text-green-600" size={22} />
          </div>
          <p className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-green-600">
            {kpis.enviadasOK}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border p-5 sm:p-6 bg-white shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium text-sm sm:text-base">Fallidas / Rebotadas</p>
            <XCircle className="text-red-600" size={22} />
          </div>
          <p className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-red-600">
            {kpis.rebotadas}
          </p>
        </div>
      </div>

      {/* Sección de Lista */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-6 pb-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Historial de envíos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Listado completo de correos de invitación.
          </p>
        </div>

        {/* Controles: Barra de búsqueda y Filtros */}
        {/* En móvil: Flex Column (uno debajo del otro). En Desktop: Row */}
        <div className="px-5 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Input Búsqueda */}
          <div className="relative w-full lg:w-auto">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, correo..."
              // w-full en móvil, w-80 en desktop
              className="w-full lg:w-80 pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Filtro Rol */}
            <div className="relative w-full sm:w-auto">
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="appearance-none w-full sm:w-48 pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

            {/* Filtro Estado */}
            <div className="relative w-full sm:w-auto">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="appearance-none w-full sm:w-48 pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

        {/* Tabla Responsive con Scroll Horizontal */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-3 pl-5 font-medium whitespace-nowrap">Usuario</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Correo</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Rol</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Estado</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Fecha de envío</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Confirmado</th>
                <th className="py-3 pr-5 text-right font-medium whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCcw className="animate-spin text-blue-500" />
                      <p>Cargando notificaciones...</p>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    No hay resultados para el criterio seleccionado.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 pl-5 whitespace-nowrap font-medium text-gray-900">
                      {r.usuario}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                      {r.correo}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {r.rol}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge value={r.estado} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                      {fmtDate(r.fechaEnvio)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {r.estado === "Confirmado" ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-medium">
                          <CheckCircle2 size={16} className="text-green-500" />
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-5 text-right whitespace-nowrap">
                      <button
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          setFocus(r);
                          setOpen(true);
                        }}
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SuccessDialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Reenvío de correo"
        subtitle="Proceso completado"
        message="El correo de invitación ha sido reenviado exitosamente al usuario."
        confirmLabel="Entendido"
      />

      <DetailsModal
        open={open}
        onClose={() => setOpen(false)}
        onForward={handleForward}
        item={focus}
      />
    </div>
  );
}