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
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative card w-[560px] p-6">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-accent" />
          <h3 className="text-3xl md:text-4xl font-semibold text-primary">
            {title}
          </h3>
        </div>
        <p className="text-slate-500 mt-1">{subtitle}</p>

        <p className="mt-5 text-primary/90">{message}</p>

        <div className="mt-6">
          <button className="btn btn-cta w-full flex items-center justify-center" onClick={onClose}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
