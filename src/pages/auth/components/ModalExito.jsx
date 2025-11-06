// src/pages/auth/components/ModalExito.jsx
import { FiCheckCircle } from "react-icons/fi";
import { useEffect } from "react";

export default function ModalExito({ open, onClose }) {
  if (!open) return null;

  // bloquea scroll y mismo blur que tu LoginModal
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
          <FiCheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">¡Contraseña creada!</h3>
            <p className="text-slate-600 mt-1">
              Tu contraseña fue creada con éxito. Ya puedes acceder al sistema.
            </p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
          >
            Ir al login
          </button>
        </div>
      </div>
    </div>
  );
}
