// src/components/ConfirmDeleteModal.jsx
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  record, // { nombre, apellidos, correo, area }
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative card w-[640px] p-6">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          <h3 className="text-3xl md:text-4xl font-semibold text-primary">
            Confirmar Eliminación
          </h3>
        </div>
        <p className="text-slate-500 mt-1">Esta acción no se puede deshacer</p>

        <p className="mt-6 text-primary/90">
          ¿Deseas eliminar este responsable académico?
        </p>

        <div className="mt-4 space-y-2">
          <p><span className="font-semibold text-primary">Nombre:</span> {record?.nombre} {record?.apellidos}</p>
          <p><span className="font-semibold text-primary">Correo:</span> {record?.correo}</p>
          <p><span className="font-semibold text-primary">Área:</span> {record?.area}</p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-white shadow bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            <TrashIcon className="w-5 h-5" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
