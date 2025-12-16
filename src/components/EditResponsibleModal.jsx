// src/components/EditResponsibleModal.jsx
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { useEditResponsible } from "../application/responsables/useEditResponsible";
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";

export default function EditResponsibleModal({
  open,
  onClose,
  onUpdate,
  initial = null,
  takenAreas = [],
  areas = [],
}) {
  const { form, setField, errors, submitting, submit } = useEditResponsible(
    initial,
    open
  );
  const [showAreas, setShowAreas] = useState(false);

  /*   useEffect(() => {
    if (!open) setShowAreas(false);
  }, [open]); */

  const availableAreasList = areas.filter((a) => {
    // Buscamos el área en takenAreas
    return !takenAreas?.find((t) => t.id === a.id);
  });

  const onSubmit = async () => {
    const result = await submit();
    if (result.ok) {
      onUpdate(result.data);
      onClose();
    }
  };

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";
  const getErrorMsg = (field) => errors[field] || null;

  if (!open) return null;

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
          Editar Responsable Académico
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Actualiza los datos del responsable académico
        </p>

        {Object.keys(errors).some((k) => k !== "general" && errors[k]) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos son inválidos. Revisa los campos en rojo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Nombre */}
          <div>
            <label className="label text-sm">Nombre *</label>
            <input
              className={`input text-sm ${errClass("nombre")}`}
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              placeholder="ej: María"
              maxLength={50}
            />
            {getErrorMsg("nombre") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />{" "}
                {getErrorMsg("nombre")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Solo letras (incluye ñ y tildes). Mínimo 3, máximo 50
                caracteres.
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="label text-sm">Apellidos *</label>
            <input
              className={`input text-sm ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => setField("apellidos", e.target.value)}
              placeholder="ej: González Pérez"
              maxLength={70}
            />
            {getErrorMsg("apellidos") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />{" "}
                {getErrorMsg("apellidos")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Solo letras (incluye ñ y tildes). Mínimo 3, máximo 70
                caracteres.
              </p>
            )}
          </div>

          {/* Correo */}
          <div className="md:col-span-2">
            <label className="label text-sm">Correo electrónico *</label>
            <input
              className={`input text-sm ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => setField("correo", e.target.value)}
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
            <label className="label text-sm">Teléfono *</label>
            <input
              className={`input text-sm ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) => setField("telefono", e.target.value)}
              placeholder="ej: 71234567"
              maxLength={8}
            />
            {getErrorMsg("telefono") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />{" "}
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
            <label className="label text-sm">CI *</label>
            <input
              className={`input text-sm ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => setField("ci", e.target.value)}
              placeholder="ej: 1234567"
              maxLength={10}
            />
            {getErrorMsg("ci") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />{" "}
                {getErrorMsg("ci")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Entre 6 y 10 dígitos.
              </p>
            )}
          </div>

          {/* Área */}
          <div className="relative md:col-span-2">
            <label className="label text-sm">Área *</label>
            <button
              type="button"
              onClick={() => setShowAreas((v) => !v)}
              className={`input text-sm flex items-center justify-between ${errClass(
                "area"
              )}`}
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Selecciona un área"}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>

            {/*  {showAreas && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto card p-0 shadow-lg">
                <ul>
                  {AREAS.filter(
                    (a) => !takenAreas.includes(a) || a === initial?.area
                  ).map((a) => (
                    <li key={a}>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setField("area", a);
                          setShowAreas(false);
                        }}
                      >
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            {showAreas && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {/* {areasConNiveles
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
                    ))} */}
                  {availableAreasList.length > 0 ? (
                    availableAreasList.map((a) => (
                      <li key={a.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setField("id_area", a.id);
                            setField("area", a.nombre);
                            setShowAreas(false);
                          }}
                        >
                          {a.nombre}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p className="px-4 py-3 text-slate-400">
                        Todas las áreas ya están completas.
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {getErrorMsg("area") && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />{" "}
                {getErrorMsg("area")}
              </p>
            )}
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
            {submitting ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
