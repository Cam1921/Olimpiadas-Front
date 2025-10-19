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
  const [errors, setErrors] = useState({}); // ✅ Errores del backend + validación local
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

  // ✅ Actualiza los niveles disponibles cuando cambia el área
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

  // ✅ Validación en tiempo real (solo para formato, no para unicidad)
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
      case 'apellidos':
        if (!value.trim()) return 'Este campo es obligatorio.';
        if (value.trim().length < 2) return 'Mínimo 2 caracteres.';
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

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const errClass = (field) => errors[field] ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300" : "";

  const onSubmit = async () => {
    setSubmitting(true);

    // Validación local de formato
    const localErrors = {};
    for (const [key, value] of Object.entries(form)) {
      const err = validateField(key, value);
      if (err) localErrors[key] = err;
    }

    // Validación de combinación área+nivel
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

      console.log('Enviando datos a /api/evaluador/', initial.id, payload);

      const response = await fetch(`/api/evaluador/${initial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          // ✅ Mostrar errores del backend EXACTAMENTE como en el registro
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Error al actualizar el evaluador.' });
        }
        setSubmitting(false);
        return;
      }

      // Éxito
      if (onUpdate) onUpdate(data.data);
      onClose();

    } catch (err) {
      console.error('Error de red o servidor:', err);
      setErrors({ general: 'Error de conexión. Inténtalo más tarde.' });
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-[720px] p-8">
        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Editar Evaluador
        </h2>
        <p className="text-slate-500 mt-2">Actualiza los datos del evaluador</p>

        {/* ✅ Mensaje de error general */}
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">⚠️ {errors.general}</p>
          </div>
        )}

        {/* ✅ Mensaje de error de campos específicos */}
        {Object.keys(errors).some(k => k !== 'general') && !errors.general && (
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
              onChange={(e) => handleFieldChange("nombre", e.target.value)}
            />
            {errors.nombre && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.nombre}
              </p>
            )}
          </div>
          {/* Apellidos */}
          <div>
            <label className="label">Apellidos *</label>
            <input
              className={`input ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => handleFieldChange("apellidos", e.target.value)}
            />
            {errors.apellidos && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.apellidos}
              </p>
            )}
          </div>
          {/* Correo */}
<div className="col-span-2">
  <label className="label">Correo electrónico *</label>
  <div className="relative">
    <input
      className={`input pr-10 ${errClass("correo")}`}
      value={form.correo}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 70) {
          handleFieldChange("correo", value);
        }
      }}
      maxLength={70}
    />
    <LockClosedIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
  </div>
  {errors.correo && (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
      <ExclamationTriangleIcon className="w-4 h-4" />
      {errors.correo}
    </p>
  )}
</div>
          {/* Teléfono */}
          <div>
            <label className="label">Teléfono *</label>
            <input
              className={`input ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) => handleFieldChange("telefono", e.target.value.replace(/\D/g, ''))}
            />
            {errors.telefono && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.telefono}
              </p>
            )}
          </div>
          {/* CI */}
          <div>
            <label className="label">CI *</label>
            <input
              className={`input ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => handleFieldChange("ci", e.target.value.replace(/\D/g, '').slice(0, 12))}
            />
            {errors.ci && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.ci}
              </p>
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
                  {AREAS.filter(area => {
                    if (initial?.area === area) return true;
                    return !isAreaCompleta(area, takenAreas);
                  }).map(a => (
                    <li key={a}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
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
          <div className="relative">
            <label className="label">Nivel *</label>
            <button
              type="button"
              onClick={() => setShowNiveles(v => !v)}
              className={`input flex items-center justify-between ${errClass("nivel")}`}
              disabled={!form.area}
            >
              <span className={form.nivel ? "text-slate-900" : "text-slate-400"}>
                {form.nivel || (form.area ? "Selecciona un nivel" : "Primero selecciona un área")}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showNiveles && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {availableNiveles.map(n => (
                    <li key={n}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
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
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-cta" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}

