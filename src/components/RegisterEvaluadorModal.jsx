// src/components/RegisterEvaluadorModal.jsx
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function RegisterEvaluadorModal({
  open,
  onClose,
  form,
  setField,
  errors,
  submitting,
  takenAreas = [],
  areas = [],
}) {
  const [showAreas, setShowAreas] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowAreas(false);
    }
  }, [open]);

  const availableAreasList = areas.filter((a) => {
    // Buscamos el área en takenAreas
    const areaTaken = takenAreas?.find((t) => t.id === a.id);

    // Ocupados: si no existe en takenAreas, es 0
    const ocupados = areaTaken?.ocupados || 0;

    // Solo mostramos el área si aún hay cupo
    return ocupados < a.cantidad_evaluadores;
  });

  // Actualiza los niveles disponibles cuando cambia el área
  /*   useEffect(() => {
    if (takenAreas.length > 0) {
      const selectedArea = areasConNiveles.find((a) => a.nombre === form.area);
      if (selectedArea) {
        const takenForArea = takenAreas.filter((a) => a.id === form.id_area);
        const available = selectedArea.niveles.filter(
          (n) => !takenForArea.some((t) => t.nivel === n.nombre_nivel)
        );
        setAvailableNiveles(available);
      } else {
        setAvailableNiveles([]);
      }
    } else {
      setAvailableNiveles([]);
    }
  }, [takenAreas]); */

  if (!open) return null;

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";
  const getErrorMsg = (field) => errors[field] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* Removido overflow-y-auto del contenedor principal para evitar doble scroll */}
      <div className="relative card w-full max-w-2xl max-h-[90vh] p-6">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
          Registrar Nuevo Evaluador
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Completa los datos del evaluador
        </p>

        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los
              campos marcados en rojo.
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
              onChange={(e) => {
                const cleaned = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  ""
                );
                setField("nombre", cleaned);
              }}
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
            <label className="label text-sm">Apellidos *</label>
            <input
              className={`input text-sm ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => {
                const cleaned = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  ""
                );
                setField("apellidos", cleaned);
              }}
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
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
                setField("telefono", cleaned);
              }}
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
            <label className="label text-sm">CI *</label>
            <input
              className={`input text-sm ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                setField("ci", cleaned);
              }}
              placeholder="ej: 12345678"
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
            {showAreas && (
              <div
                className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg"
                style={{ position: "absolute", top: "100%", left: 0 }}
              >
                <ul className="max-h-56"> {/* Eliminado overflow-auto aquí */}
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
                          {a.nombre} (
                          {a.cantidad_evaluadores -
                            (takenAreas.find((t) => t.id === a.id)?.ocupados ||
                              0)}{" "}
                          disponibles)
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
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("area")}
              </p>
            )}
          </div>

          {/* Nivel */}
          {/*  <div className="relative md:col-span-2">
            <label className="label text-sm">Nivel *</label>
            <button
              type="button"
              onClick={() => setShowNiveles((v) => !v)}
              className={`input text-sm flex items-center justify-between ${errClass(
                "nivel"
              )}`}
              disabled={!form.area}
            >
              <span
                className={form.nivel ? "text-slate-900" : "text-slate-400"}
              >
                {form.nivel ||
                  (form.area
                    ? "Selecciona un nivel"
                    : "Primero selecciona un área")}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>
            {showNiveles && (
              <div
                className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white border border-slate-200 rounded shadow-lg"
                style={{ position: "absolute", top: "100%", left: 0 }}
              >
                <ul className="max-h-56 overflow-auto">
                  {availableNiveles.length > 0 ? (
                    availableNiveles.map((n) => (
                      <li key={n.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setField("nivel", n.nombre_nivel);
                            setShowNiveles(false);
                          }}
                        >
                          {n.nombre_nivel}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p className="px-4 py-3 text-slate-400">
                        Todos los niveles para esta área ya están asignados.
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {getErrorMsg("nivel") && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("nivel")}
              </p>
            )}
          </div> */}
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