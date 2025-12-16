// src/pages/dashboard/notificaciones/components/DetailsModal.jsx
import { Loader2, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useState } from "react";

export default function DetailsModal({ open, onClose, onForward, item }) {
  const [sending, setSending] = useState(false);
  if (!open || !item) return null;

  const handleReenviar = async () => {
    try {
      setSending(true);
      await onForward(item);
    } finally {
      setSending(false);
    }
  };

  const fmt = (iso) =>
    new Date(iso).toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 supports-[backdrop-filter:blur(0)]:bg-black/20 backdrop-blur-sm md:backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Contenedor Modal */}
      <div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        {/* Contenido */}
        <div
          className="relative w-full max-w-lg md:max-w-2xl bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 pr-8">
              Detalles del envío
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Información completa sobre el correo enviado
            </p>
          </div>

          {/* Grilla responsiva: 1 columna en móvil, 2 en tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2 border-t pt-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Usuario</p>
              <p className="font-medium text-gray-900 truncate">{item.usuario}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Correo</p>
              <p className="font-medium text-gray-900 truncate">{item.correo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha/hora</p>
              <p className="font-medium text-gray-900">{fmt(item.fechaEnvio)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estado</p>
              <StatusBadge value={item.estado} />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              onClick={handleReenviar}
              disabled={sending}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all ${
                sending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {sending && <Loader2 size={18} className="animate-spin" />}
              {sending ? "Reenviando..." : "Reenviar correo"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}