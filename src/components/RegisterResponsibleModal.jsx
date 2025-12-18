// src/components/RegisterResponsibleModal.jsx
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function RegisterResponsibleModal({
  open,
  onClose,
  form,
  setField,
  errors,
  submitting,
  onSubmit,
  takenAreas = [],
  areas = [],
}) {
  const [showAreas, setShowAreas] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setShowAreas(false);
      setAreaSearch("");
    }
  }, [open]);

  const availableAreasList = areas.filter((a) => {
    return !takenAreas?.find((t) => t.id === a.id);
  });

  const filteredAreas = availableAreasList.filter((a) =>
    a.nombre.toLowerCase().includes(areaSearch.toLowerCase())
  );

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";

  const getErrorMsg = (field) => errors[field] || null;

  if (!open) return null;

  const displayValue = form.area || areaSearch || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
          Registrar Nuevo Responsable Académico
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Completa los datos del responsable académico
        </p>

        {/* ✅ Caja de error global con espacio reservado */}
        <div className="min-h-[48px] mb-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-sm font-medium">
                ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los
                campos marcados en rojo.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Nombre */}
          <div>
            <label className="label text-sm">Nombre *</label>
            <input
              className={`input text-sm ${errClass("nombre")}`}
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              placeholder="ej: María"
            />
            <div className="min-h-[32px] mt-1">
              {getErrorMsg("nombre") ? (
                <p className="flex items-center gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getErrorMsg("nombre")}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Debe tener al menos 3 letras.
                </p>
              )}
            </div>
          </div>

          {/* Apellidos */}
          <div>
            <label className="label text-sm">Apellidos *</label>
            <input
              className={`input text-sm ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => setField("apellidos", e.target.value)}
              placeholder="ej: González Pérez"
            />
            <div className="min-h-[32px] mt-1">
              {getErrorMsg("apellidos") ? (
                <p className="flex items-center gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getErrorMsg("apellidos")}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Debe tener al menos 3 letras.
                </p>
              )}
            </div>
          </div>

          {/* Correo — ✅ Solo muestra error si existe */}
          <div className="md:col-span-2">
            <label className="label text-sm">Correo electrónico *</label>
            <input
              className={`input text-sm ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 70) {
                  setField("correo", value);
                }
              }}
              placeholder="ej: maria@gmail.com o maria@est.umss.edu"
              maxLength={70}
            />
            <div className="min-h-[36px] mt-1">
              {getErrorMsg("correo") && (
                <p className="flex items-start gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {getErrorMsg("correo")}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="label text-sm">Teléfono *</label>
            <input
              className={`input text-sm ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) =>
                setField("telefono", e.target.value.replace(/\D/g, ""))
              }
              placeholder="ej: 71234567"
            />
            <div className="min-h-[32px] mt-1">
              {getErrorMsg("telefono") ? (
                <p className="flex items-center gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getErrorMsg("telefono")}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  8 dígitos, empieza con 6 o 7.
                </p>
              )}
            </div>
          </div>

          {/* CI */}
          <div>
            <label className="label text-sm">CI *</label>
            <input
              className={`input text-sm ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) =>
                setField("ci", e.target.value.replace(/\D/g, ""))
              }
              placeholder="ej: 1234567"
            />
            <div className="min-h-[32px] mt-1">
              {getErrorMsg("ci") ? (
                <p className="flex items-center gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getErrorMsg("ci")}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Entre 6 y 10 dígitos.
                </p>
              )}
            </div>
          </div>

          {/* Área con buscador */}
          <div className="relative md:col-span-2">
            <label className="label text-sm">Área *</label>
            <div className="relative">
              <input
                type="text"
                className={`input text-sm w-full ${errClass("area")}`}
                placeholder="Buscar área..."
                value={displayValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setAreaSearch(value);
                  setField("area", "");
                  setField("id_area", null);
                  setShowAreas(true);
                }}
                onFocus={() => setShowAreas(true)}
                onBlur={() => setTimeout(() => setShowAreas(false), 200)}
                autoComplete="off"
              />
              <ChevronDownIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {showAreas && (
              <div
                className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg max-h-56 overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {filteredAreas.length > 0 ? (
                  filteredAreas.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-slate-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setField("id_area", a.id);
                        setField("area", a.nombre);
                        setAreaSearch("");
                        setShowAreas(false);
                      }}
                    >
                      {a.nombre}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-slate-400">
                    {availableAreasList.length === 0
                      ? "Todas las áreas ya tienen un responsable asignado."
                      : "No se encontraron áreas disponibles."}
                  </div>
                )}
              </div>
            )}

            <div className="min-h-[32px] mt-1">
              {getErrorMsg("area") ? (
                <p className="flex items-center gap-1 text-red-500 text-xs">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getErrorMsg("area")}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6">
          <button className="btn btn-ghost w-full sm:w-auto" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-cta w-full sm:w-auto"
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