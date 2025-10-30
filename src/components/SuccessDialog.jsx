// src/components/SuccessDialog.jsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessDialog({
  open,
  onClose,
  title = "Operación Exitosa",
  subtitle = "La operación se completó correctamente",
  message = "Responsable académico registrado correctamente.",
  confirmLabel = "Aceptar",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Contenido del modal */}
      <div className="relative card w-full max-w-[560px] p-6">
        {/* Botón de cerrar */}
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Icono + Título */}
        <div className="flex items-center gap-3">
          <CheckCircleIcon className="w-7 h-7 text-accent flex-shrink-0" />
          <h3 className="text-2xl md:text-3xl font-bold text-primary">
            {title}
          </h3>
        </div>

        {/* Subtítulo */}
        <p className="text-slate-500 mt-1">{subtitle}</p>

        {/* Mensaje detallado */}
        <p className="mt-4 text-primary/90 leading-relaxed">{message}</p>

        {/* Botón de confirmación */}
        <div className="mt-6">
          <button
            className="btn btn-cta w-full"
            onClick={onClose}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}