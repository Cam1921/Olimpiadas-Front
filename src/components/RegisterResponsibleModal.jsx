// src/components/RegisterResponsibleModal.jsx
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";

export default function RegisterResponsibleModal({
  open,
  onClose,
  form,
  setField,
  errors,
  submitting,
  onSubmit,
  takenAreas = [],
}) {
  const [showAreas, setShowAreas] = useState(false);
  const [areasConNiveles, setAreasConNiveles] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreasConNiveles(); // devuelve tu JSON
        setAreasConNiveles(data);
      } catch (err) {
        console.error("Error al cargar áreas con niveles:", err);
      }
    };

    fetchAreas();
  }, []);
  useEffect(() => {
    if (!open) setShowAreas(false);
  }, [open]);

  if (!open) return null;

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";
  const getErrorMsg = (field) => errors[field] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-[720px] p-8">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        {/* ✅ Título correcto para el modal de registro */}
        <h2 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Registrar Nuevo <br /> Responsable Académico
        </h2>
        <p className="text-slate-500 mt-2">
          Completa los datos del responsable académico
        </p>
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los
              campos marcados en rojo.
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
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("nombre")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 letras.
              </p>
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
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("apellidos")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 letras.
              </p>
            )}
          </div>
          {/* Correo */}
          <div className="col-span-2">
            <label className="label">Correo electrónico *</label>
            <input
              className={`input ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 70) {
                  setField("correo", value);
                }
              }}
              placeholder="ej: maria@gmail.com"
              maxLength={70}
            />
            {getErrorMsg("correo") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("correo")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe contener "@" y ".com". Máximo 70 caracteres.
              </p>
            )}
          </div>
          {/* Teléfono */}
          <div>
            <label className="label">Teléfono *</label>
            <input
              className={`input ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) =>
                setField("telefono", e.target.value.replace(/\D/g, ""))
              }
              placeholder="ej: 71234567"
            />
            {getErrorMsg("telefono") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("telefono")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                8 dígitos, empieza con 6 o 7.
              </p>
            )}
          </div>
          {/* CI */}
          <div>
            <label className="label">CI *</label>
            <input
              className={`input ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) =>
                setField("ci", e.target.value.replace(/\D/g, ""))
              }
              placeholder="ej: 1234567"
            />
            {getErrorMsg("ci") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("ci")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Entre 6 y 10 dígitos.
              </p>
            )}
          </div>
          {/* Área */}
          <div className="relative">
            <label className="label">Área *</label>
            <button
              type="button"
              onClick={() => setShowAreas((v) => !v)}
              className={`input flex items-center justify-between ${errClass(
                "area"
              )}`}
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Selecciona un área"}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showAreas && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {areasConNiveles
                    .filter((a) => !takenAreas.includes(a.nombre))
                    .map((a) => (
                      <li key={a.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setField("area", a.nombre);
                            console.log(takenAreas);
                            setShowAreas(false);
                          }}
                        >
                          {a.nombre}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {getErrorMsg("area") && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("area")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          {/* ✅ Botón que dice "Registrar" */}
          <button
            className="btn btn-cta"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
