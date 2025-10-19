// src/components/RegisterEvaluadorModal.jsx

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { isAreaCompleta, getNivelesByArea } from "../utils/areaUtils"; // 👈 Importa getNivelesByArea

export default function RegisterEvaluadorModal({
  open,
  onClose,
  form,
  setField,
  errors,
  submitting,
  onSubmit,
  takenAreas = [], // 👈 Ahora es un array de objetos { area, nivel }
}) {
  const [showAreas, setShowAreas] = useState(false);
  const [showNiveles, setShowNiveles] = useState(false);
  const [availableNiveles, setAvailableNiveles] = useState([]); // 👈 Inicialmente vacío

  useEffect(() => {
    if (!open) {
      setShowAreas(false);
      setShowNiveles(false);
    }
  }, [open]);

  // ✅ Actualiza los niveles disponibles cuando cambia el área (usando niveles específicos)
  useEffect(() => {
    if (form.area) {
      const nivelesPorArea = getNivelesByArea(form.area);
      const takenForArea = takenAreas.filter(a => a.area === form.area);
      const available = nivelesPorArea.filter(n => 
        !takenForArea.some(t => t.nivel === n)
      );
      setAvailableNiveles(available);
    } else {
      setAvailableNiveles([]); // Vacío si no hay área seleccionada
    }
  }, [form.area, takenAreas]);

  if (!open) return null;

  const errClass = (field) => errors[field] ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300" : "";
  const getErrorMsg = (field) => errors[field] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-[720px] p-8">
        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Registrar Nuevo <br /> Evaluador
        </h2>
        <p className="text-slate-500 mt-2">Completa los datos del evaluador</p>
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los campos marcados en rojo.
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
              onChange={(e) => {
                // ✅ Solo letras, espacios, tildes y ñ
                const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
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
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 3 letras.</p>
            )}
          </div>
          {/* Apellidos */}
          <div>
            <label className="label">Apellidos *</label>
            <input
              className={`input ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => {
                // ✅ Solo letras, espacios, tildes y ñ
                const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
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
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 3 letras.</p>
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
    maxLength={70} // Refuerzo visual
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
              onChange={(e) => {
                // ✅ Solo dígitos y máximo 8 caracteres
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 8);
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
              <p className="text-xs text-slate-400 mt-1">8 dígitos, empieza con 6 o 7.</p>
            )}
          </div>
          {/* CI */}
          <div>
            <label className="label">CI *</label>
            <input
              className={`input ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
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
              <p className="text-xs text-slate-400 mt-1">Entre 6 y 10 dígitos.</p>
            )}
          </div>
          {/* Área */}
          <div className="relative">
            <label className="label">Área *</label>
            <button
              type="button"
              onClick={() => setShowAreas(v => !v)}
              className={`input flex items-center justify-between ${errClass("area")}`}
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Selecciona un área"}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showAreas && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {AREAS.filter(area => !isAreaCompleta(area, takenAreas)).map(a => (
                    <li key={a}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
                        onMouseDown={e => e.preventDefault()}
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
            )}
            {getErrorMsg("area") && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("area")}
              </p>
            )}
          </div>
          {/* Nivel */}
          <div className="relative">
            <label className="label">Nivel *</label>
            <button
              type="button"
              onClick={() => setShowNiveles(v => !v)}
              className={`input flex items-center justify-between ${errClass("nivel")}`}
              disabled={!form.area} // ✅ Deshabilita si no hay área seleccionada
            >
              <span className={form.nivel ? "text-slate-900" : "text-slate-400"}>
                {form.nivel || (form.area ? "Selecciona un nivel" : "Primero selecciona un área")}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showNiveles && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {availableNiveles.length > 0 ? (
                    availableNiveles.map(n => (
                      <li key={n}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setField("nivel", n);
                            setShowNiveles(false);
                          }}
                        >
                          {n}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p className="px-4 py-3 text-slate-400">Todos los niveles para esta área ya están asignados.</p>
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
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
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
