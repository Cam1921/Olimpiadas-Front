// src/components/EditEvaluadorModal.jsx
import { useEffect, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { getNivelesByArea, isAreaCompleta } from "../utils/areaUtils";

export default function EditEvaluadorModal({
  open,
  onClose,
  onUpdate,
  initial = null,
  takenAreas = [],
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    ci: "",
    area: "",
    nivel: "",
  });
  const [showAreas, setShowAreas] = useState(false);
  const [showNiveles, setShowNiveles] = useState(false);
  const [availableNiveles, setAvailableNiveles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && initial) {
      setForm({
        nombre: initial.nombre || "",
        apellidos: initial.apellidos || "",
        correo: initial.correo || "",
        telefono: (initial.telefono || "").replace(/\+591\s?/, ""),
        ci: initial.ci || "",
        area: initial.area || "",
        nivel: initial.nivel || "",
      });
      setErrors({});
      setShowAreas(false);
      setShowNiveles(false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (form.area) {
      const nivelesPorArea = getNivelesByArea(form.area);
      const takenForArea = takenAreas.filter(a => a.area === form.area);
      const available = nivelesPorArea.filter(n => 
        !takenForArea.some(t => t.nivel === n)
      );
      setAvailableNiveles(available);
    } else {
      setAvailableNiveles([]);
    }
  }, [form.area, takenAreas]);

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
      case 'apellidos':
        if (!value.trim()) return 'Este campo es obligatorio.';
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) return 'Solo letras, espacios, tildes y ñ.';
        return null;
      case 'correo':
        if (!value.trim()) return 'El correo es obligatorio.';
        if (value.length > 70) return 'El correo no debe exceder los 70 caracteres.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Formato de correo inválido.';
        if (!value.endsWith('.com')) return 'El dominio debe terminar en ".com".';
        return null;
      case 'telefono':
        const cleanTel = value.replace(/\D/g, '');
        if (!value.trim()) return 'El teléfono es obligatorio.';
        if (!/^[67]\d{7}$/.test(cleanTel)) return '8 dígitos, debe comenzar con 6 o 7.';
        return null;
      case 'ci':
        const cleanCI = value.replace(/\D/g, '');
        if (!value.trim()) return 'El CI es obligatorio.';
        if (!/^\d{6,10}$/.test(cleanCI)) return 'El CI debe tener entre 6 y 10 dígitos.';
        return null;
      case 'area':
        if (!value) return 'Selecciona un área.';
        return null;
      case 'nivel':
        if (!value) return 'Selecciona un nivel.';
        if (!getNivelesByArea(form.area).includes(value)) return 'Nivel inválido para esta área.';
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (name, rawValue) => {
    let value = rawValue;

    // Aplicar limpieza según el campo
    if (name === 'nombre' || name === 'apellidos') {
      value = rawValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    } else if (name === 'telefono') {
      value = rawValue.replace(/\D/g, '').slice(0, 8);
    } else if (name === 'ci') {
      value = rawValue.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'correo') {
      if (rawValue.length > 70) return; // no permitir más de 70
      value = rawValue;
    }

    setForm(prev => ({ ...prev, [name]: value }));

    // Validar en tiempo real
    const err = validateField(name, value);
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      if (err) {
        return { ...rest, [name]: err };
      }
      return rest;
    });
  };

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";

  const onSubmit = async () => {
    setSubmitting(true);

    const localErrors = {};
    for (const [key, value] of Object.entries(form)) {
      const err = validateField(key, value);
      if (err) localErrors[key] = err;
    }

    const combinationExists = takenAreas.some(a => 
      a.area === form.area && a.nivel === form.nivel && 
      !(initial?.area === form.area && initial?.nivel === form.nivel)
    );
    if (combinationExists) {
      localErrors.area = 'Ya existe un evaluador para esta combinación de área y nivel.';
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
        telefono: form.telefono.replace(/\D/g, ''),
        ci: form.ci.replace(/\D/g, ''),
        area: form.area,
        nivel: form.nivel,
      };

      const response = await fetch(`/api/evaluador/${initial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Error al actualizar el evaluador.' });
        }
        setSubmitting(false);
        return;
      }

      if (onUpdate) onUpdate(data.data);
      onClose();
    } catch (err) {
      setErrors({ general: 'Error de conexión. Inténtalo más tarde.' });
      setSubmitting(false);
    }
  };

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
          Editar Evaluador
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Actualiza los datos del evaluador
        </p>

        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">⚠️ {errors.general}</p>
          </div>
        )}

        {Object.keys(errors).some(k => k !== 'general') && !errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los campos marcados en rojo.
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
              onChange={(e) => handleFieldChange("nombre", e.target.value)}
              placeholder="ej: María"
            />
            {errors.nombre ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.nombre}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 caracteres. Solo letras, espacios, tildes y ñ.
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="label text-sm">Apellidos *</label>
            <input
              className={`input text-sm ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => handleFieldChange("apellidos", e.target.value)}
              placeholder="ej: González Pérez"
            />
            {errors.apellidos ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.apellidos}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 caracteres. Solo letras, espacios, tildes y ñ.
              </p>
            )}
          </div>

          {/* Correo */}
          <div className="md:col-span-2">
            <label className="label text-sm">Correo electrónico *</label>
               <div className="relative">
                <input
                  className={`input text-sm ${errClass("correo")}`}
                  value={form.correo}
                  onChange={(e) => handleFieldChange("correo", e.target.value)}
                  placeholder="ej: maria@gmail.com"
                  maxLength={70}
                />
              </div>
            {errors.correo ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.correo}
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
              onChange={(e) => handleFieldChange("telefono", e.target.value)}
              placeholder="ej: 71234567"
            />
            {errors.telefono ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.telefono}
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
              onChange={(e) => handleFieldChange("ci", e.target.value)}
              placeholder="ej: 1234567"
            />
            {errors.ci ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.ci}
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
              onClick={() => setShowAreas(v => !v)}
              className={`input text-sm flex items-center justify-between ${errClass("area")}`}
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Selecciona un área"}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>
            {showAreas && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto card p-0 shadow-lg">
                <ul>
                  {AREAS.filter(area => {
                    if (initial?.area === area) return true;
                    return !isAreaCompleta(area, takenAreas);
                  }).map(a => (
                    <li key={a}>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => {
                          handleFieldChange("area", a);
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
            {errors.area && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.area}
              </p>
            )}
          </div>

          {/* Nivel */}
          <div className="relative md:col-span-2">
            <label className="label text-sm">Nivel *</label>
            <button
              type="button"
              onClick={() => setShowNiveles(v => !v)}
              className={`input text-sm flex items-center justify-between ${errClass("nivel")}`}
              disabled={!form.area}
            >
              <span className={form.nivel ? "text-slate-900" : "text-slate-400"}>
                {form.nivel || (form.area ? "Selecciona un nivel" : "Primero selecciona un área")}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>
            {showNiveles && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto card p-0 shadow-lg">
                <ul>
                  {availableNiveles.map(n => (
                    <li key={n}>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => {
                          handleFieldChange("nivel", n);
                          setShowNiveles(false);
                        }}
                      >
                        {n}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.nivel && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.nivel}
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