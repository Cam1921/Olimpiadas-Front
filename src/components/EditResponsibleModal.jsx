// src/components/EditResponsibleModal.jsx
import { useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { useEditResponsible } from "../application/responsables/useEditResponsible";

export default function EditResponsibleModal({
  open,
  onClose,
  onUpdate,
  initial = null,
  takenAreas = [],
}) {
  const { form, setField, errors, submitting, submit } = useEditResponsible(initial, takenAreas);

  useEffect(() => {
    if (!open) return;
  }, [open]);

  const onSubmit = async () => {
    const result = await submit();
    if (result.ok) {
      onUpdate(result.data);
      onClose();
    }
  };

  const errClass = (field) => errors[field]?.ok === false ? "border-2 border-red-500" : "";
  const getErrorMsg = (field) => (errors[field]?.ok === false) ? errors[field].msg : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-[720px] p-8">
        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Editar Responsable <br /> Académico
        </h2>
        <p className="text-slate-500 mt-2">Actualiza los datos del responsable académico</p>

        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">⚠️ {errors.general}</p>
          </div>
        )}

        {Object.keys(errors).some(k => k !== 'general' && errors[k]?.ok === false) && !errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los campos en rojo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mt-6">
          {/* Nombre */}
          <div>
            <label className="label">Nombre *</label>
            <input
              className={`input ${errClass("nombre")}`}
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              placeholder="ej: María"
            />
            {getErrorMsg("nombre") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("nombre")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 3 letras.</p>
            )}
          </div>
          {/* Apellidos */}
          <div>
            <label className="label">Apellidos *</label>
            <input
              className={`input ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => setField("apellidos", e.target.value)}
              placeholder="ej: González Pérez"
            />
            {getErrorMsg("apellidos") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("apellidos")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 3 letras.</p>
            )}
          </div>
          {/* Correo */}
          <div className="col-span-2">
            <label className="label">Correo electrónico *</label>
            <input
              className={`input ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => setField("correo", e.target.value)}
              placeholder="ej: maria@gmail.com"
            />
            {getErrorMsg("correo") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("correo")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Ejemplo: nombre@dominio.com</p>
            )}
          </div>
          {/* Teléfono */}
          <div>
            <label className="label">Teléfono *</label>
            <input
              className={`input ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) => setField("telefono", e.target.value.replace(/\D/g, ""))}
              placeholder="ej: 71234567"
            />
            {getErrorMsg("telefono") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("telefono")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">8 dígitos, empieza con 6 o 7.</p>
            )}
          </div>
          {/* CI */}
          <div>
            <label className="label">CI *</label>
            <input
              className={`input ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => setField("ci", e.target.value.replace(/\D/g, ""))}
              placeholder="ej: 1234567"
            />
            {getErrorMsg("ci") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("ci")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Entre 6 y 10 dígitos.</p>
            )}
          </div>
          {/* Área */}
          <div className="relative">
            <label className="label">Área *</label>
            <button
              type="button"
              onClick={() => {}}
              className={`input flex items-center justify-between ${errClass("area")}`}
              disabled
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Área fija"}
              </span>
            </button>
            {getErrorMsg("area") && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("area")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-cta"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}