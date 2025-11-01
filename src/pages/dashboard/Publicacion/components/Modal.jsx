// src/.../Modal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  // Bloquear scroll global mientras el modal esté abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <>
      {/* Backdrop: cubre TODA la ventana (encima del header) */}
      <div className="fixed inset-0 z-[99998] bg-black/40" />

      {/* Dialog */}
      <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-12 px-4">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl border border-[#23263D]/10 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F8FAFB]"
              aria-label="Cerrar"
            >
              <IoClose size={18} />
            </button>
          </div>

          {/* Body scrolleable */}
          <div className="px-6 pb-4 overflow-auto grow">{children}</div>

          {/* Footer fijo (opcional) */}
          {footer && (
            <div className="px-6 py-4 bg-[#F8FAFB] border-t border-[#23263D]/10 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
