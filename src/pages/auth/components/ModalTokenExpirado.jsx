// src/pages/auth/components/ModalTokenExpirado.jsx
import { FiAlertTriangle } from "react-icons/fi";
import { useEffect } from "react";

export default function ModalTokenExpirado({ open, onClose, onResend }) {
  if (!open) return null;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="mx-auto mt-24 w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="text-amber-600" size={24} />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Tu enlace ha expirado</h3>
            <p className="text-slate-600 mt-1">
              El enlace es inválido o ya fue usado. Puedes solicitar uno nuevo.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Cerrar
          </button>
          <button
            onClick={onResend}
            className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    </div>
  );
}
