// src/components/EditResponsibleModal.jsx
import { useEffect, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { cleanNameInput, cleanPhoneInput, cleanCIInput } from "../utils/text";
// ✅ Regex robusta: exige TLD de al menos 2 letras
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
export default function EditResponsibleModal({
  open,
  onClose,
  onUpdate,
  initial = null,
  takenAreas = [],
}) {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    ci: "",
    area: "",
  });
  const [showAreas, setShowAreas] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && initial) {
      setForm({
        id: initial.id || "",
        nombre: initial.nombre || "",
        apellidos: initial.apellidos || "",
        correo: initial.correo || "",
        telefono: (initial.telefono || "").replace(/\+591\s?/, ""),
        ci: initial.ci || "",
        area: initial.area || "",
      });
      setErrors({});
      setSubmitting(false);
      setShowAreas(false);
    }
  }, [open, initial]);

  // ✅ Validación en tiempo real con persistencia de errores
  useEffect(() => {
    const newErrors = {};
    if (form.nombre && form.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (form.apellidos && form.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    }
    if (form.correo.trim() !== "" && !EMAIL_REGEX.test(form.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido (ej: nombre@dominio.com).';
    }
    if (form.telefono && !/^[67]\d{7}$/.test(form.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    }
    if (form.ci && !/^\d{6,10}$/.test(form.ci.replace(/\D/g, ''))) {
      newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    }
    setErrors(prev => {
      const { nombre, apellidos, correo, telefono, ci, ...rest } = prev;
      return { ...rest, ...newErrors };
    });
  }, [form]);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres.';
    if (!form.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';
    else if (form.apellidos.trim().length < 2) newErrors.apellidos = 'Mínimo 2 caracteres.';
    if (!form.correo.trim()) newErrors.correo = 'El correo es obligatorio.';
    else if (!EMAIL_REGEX.test(form.correo)) newErrors.correo = 'El correo debe tener un formato válido (ej: pauline@example.com).';
    if (!form.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio.';
    else if (!/^[67]\d{7}$/.test(form.telefono.replace(/\D/g, ''))) newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    if (!form.ci?.trim()) newErrors.ci = 'El CI es obligatorio.';
    else if (!/^\d{6,10}$/.test(form.ci.replace(/\D/g, ''))) newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    if (!form.area) newErrors.area = 'Selecciona un área.';
    else if (takenAreas.includes(form.area) && form.area !== initial?.area) {
      newErrors.area = 'Esta área ya tiene un responsable asignado.';
    }
    return newErrors;
  };

  const onSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        telefono: form.telefono.replace(/\+591\s?/, ""),
      };
      const response = await fetch(`/api/responsable-academico/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const normalized = {};
          for (const [field, msgs] of Object.entries(data.errors)) {
            normalized[field] = msgs[0];
          }
          setErrors(normalized);
        } else {
          setErrors({ general: data.message || 'Error al actualizar.' });
        }
        return;
      }

      onUpdate(data.data);
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setErrors({ general: 'Error de conexión. Inténtalo más tarde.' });
    } finally {
      setSubmitting(false);
    }
  };

  const errClass = (field) => errors[field] ? "border-2 border-red-500" : "";
  const getErrorMsg = (field) => errors[field] || null;

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

        {Object.keys(errors).length > 0 && !errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos son inválidos. Revisa los campos en rojo.
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
              onChange={(e) => setForm({ ...form, nombre: cleanNameInput(e.target.value) })}
              placeholder="ej: María"
            />
            {getErrorMsg("nombre") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("nombre")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 2 letras.</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="label">Apellidos *</label>
            <input
              className={`input ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: cleanNameInput(e.target.value) })}
              placeholder="ej: González Pérez"
            />
            {getErrorMsg("apellidos") ? (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" /> {getErrorMsg("apellidos")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Debe tener al menos 2 letras.</p>
            )}
          </div>

          {/* Correo */}
          <div className="col-span-2">
            <label className="label">Correo electrónico *</label>
            <input
              className={`input ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
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
              onChange={(e) => setForm({ ...form, telefono: cleanPhoneInput(e.target.value) })}
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
              onChange={(e) => setForm({ ...form, ci: cleanCIInput(e.target.value) })}
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
                  {AREAS.filter(a => !takenAreas.includes(a) || a === form.area).map(a => (
                    <li key={a}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => {
                          setForm({ ...form, area: a });
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