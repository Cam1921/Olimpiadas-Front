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
      await onForward(item); // pasa el item al padre
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
    // 1. Usamos un Fragment (<>) para renderizar dos elementos 'fixed' hermanos
    <>
      {/* 🔵 1. El Backdrop con blur */}
      {/* Este div 'fixed' se asegura de cubrir toda la pantalla (viewport) */}
      <div
        className="fixed inset-0 z-50 bg-black/30 supports-[backdrop-filter:blur(0)]:bg-black/20 backdrop-blur-sm md:backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* 🔵 2. El Contenedor del Modal (con scroll y centrado) */}
      {/* Este 'div' también es 'fixed' y se encarga de centrar el contenido y permitir scroll */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 md:items-center md:pt-4"
        onClick={onClose} // Cierra el modal al hacer clic fuera
      >
        {/* 🔵 3. El Contenido del Modal */}
        {/* Usamos w-full y max-w-[...] para hacerlo responsivo en móviles */}
        <div
          className="relative w-full max-w-[680px] rounded-2xl bg-white shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()} // Evita que el clic DENTRO del modal lo cierre
        >
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          <h3 className="text-2xl font-semibold text-gray-900">
            Detalles del envío
          </h3>
          <p className="text-gray-500 mt-1">
            Información completa sobre el correo enviado
          </p>

          {/* ... El resto de tu contenido va aquí ... */}
          {/* (No es necesario cambiar nada de lo que sigue) */}

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-xs text-gray-500">Usuario</p>
              <p className="font-medium">{item.usuario}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Correo</p>
              <p className="font-medium">{item.correo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fecha/hora</p>
              <p className="font-medium">{fmt(item.fechaEnvio)}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">Estado</p>
              <StatusBadge value={item.estado} />
            </div>
          </div>

          <div className="mt-6 rounded-lg border p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Respuesta del servidor:</span>{" "}
              {item.respuesta}
            </p>
            {item.motivoFallo && (
              <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                <span className="font-medium">Motivo del fallo:</span>{" "}
                {item.motivoFallo}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              onClick={handleReenviar}
              disabled={sending}
              className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 ${
                sending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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
