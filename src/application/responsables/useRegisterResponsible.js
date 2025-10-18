// src/application/responsables/useRegisterResponsable.js
import { useState, useCallback, useEffect } from 'react';
import { cleanNameInput, cleanPhoneInput, cleanCIInput } from '../../utils/text';
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
export function useRegisterResponsable(takenAreas = []) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ci: '',
    area: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    let cleaned = value;
    if (name === 'nombre' || name === 'apellidos') {
      cleaned = cleanNameInput(value);
    } else if (name === 'telefono') {
      cleaned = cleanPhoneInput(value);
    } else if (name === 'ci') {
      cleaned = cleanCIInput(value); // Asume que esto devuelve solo dígitos
    }
    setForm(prev => ({ ...prev, [name]: cleaned }));
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetForm = useCallback(() => {
    setForm({ nombre: '', apellidos: '', correo: '', telefono: '', ci: '', area: '' });
    setErrors({});
  }, []);

  // Validación en tiempo real (solo si el campo tiene valor)
  useEffect(() => {
    const newErrors = {};
    if (form.nombre && form.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (form.apellidos && form.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    }
    if (form.correo && !EMAIL_REGEX.test(form.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido (ej: paulin@example.com).';
    }
    if (form.telefono && !/^[67]\d{7}$/.test(form.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    }

    if (form.ci && !/^\d{6,10}$/.test(form.ci)) {
      newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [form]);

  const validate = useCallback((data) => {
    const newErrors = {};
    if (!data.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    else if (data.nombre.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres.';
    if (!data.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';
    else if (data.apellidos.trim().length < 2) newErrors.apellidos = 'Mínimo 2 caracteres.';
    if (!data.correo.trim()) newErrors.correo = 'El correo es obligatorio.';
    else if (!EMAIL_REGEX.test(data.correo)) newErrors.correo = 'El correo debe tener un formato válido (ej: paulin@example.com).';
    if (!data.telefono) newErrors.telefono = 'El teléfono es obligatorio.';
    else if (!/^[67]\d{7}$/.test(data.telefono)) newErrors.telefono = '8 dígitos, inicia con 6 o 7.';
    if (!data.ci) newErrors.ci = 'El CI es obligatorio.';

    else if (!/^\d{6,10}$/.test(data.ci)) newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    if (!data.area) newErrors.area = 'Selecciona un área.';
    else if (takenAreas.includes(data.area)) newErrors.area = 'Esta área ya tiene un responsable asignado.';
    return newErrors;
  }, [takenAreas]);

  const submit = useCallback(async () => {
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return { ok: false, error: 'Corrige los errores.' };
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/responsable-academico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
          return { ok: false, error: 'Datos ya registrados.' };
        }
        throw new Error(data.message || 'Error');
      }
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: 'Error de conexión.' };
    } finally {
      setSubmitting(false);
    }
  }, [form, validate]);

  return { form, setField, errors, submitting, submit, resetForm };
}