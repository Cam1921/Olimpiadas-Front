// src/application/evaluadores/useRegisterEvaluador.js
import { useState, useCallback, useEffect } from 'react';
import { AREAS } from '../../services/areas';

export function useRegisterEvaluador(takenAreas = []) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ci: '',
    area: '',
    nivel: '', // ✅ Campo nuevo
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Al editar un campo, limpia su error
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      ci: '',
      area: '',
      nivel: '', // ✅ Reinicia nivel
    });
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
    if (form.correo && !/^\S+@\S+\.\S+$/.test(form.correo)) {
      newErrors.correo = 'Formato de correo inválido. Ej: ejemplo@gmail.com';
    }
    if (form.telefono && !/^[67]\d{7}$/.test(form.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7. Ej: 71234567';
    }
    if (form.ci && !/^\d{7,10}$/.test(form.ci.replace(/\D/g, ''))) {
      newErrors.ci = 'El CI debe tener entre 7 y 10 dígitos. Ej: 1234567';
    }
    if (form.nivel && !['Primaria', 'Secundaria'].includes(form.nivel)) {
      newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".';
    }
    setErrors(prev => {
      const updated = { ...prev, ...newErrors };
      return updated;
    });
  }, [form]);

  const validate = useCallback((data, takenAreas) => {
    const newErrors = {};
    if (!data.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    else if (data.nombre.trim().length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    if (!data.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';
    else if (data.apellidos.trim().length < 2) newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    if (!data.correo.trim()) newErrors.correo = 'El correo es obligatorio.';
    else if (!/^\S+@\S+\.\S+$/.test(data.correo)) newErrors.correo = 'Formato de correo inválido.';
    if (!data.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio.';
    else if (!/^[67]\d{7}$/.test(data.telefono.replace(/\D/g, ''))) newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    if (!data.ci?.trim()) newErrors.ci = 'El CI es obligatorio.';
    else if (!/^\d{7,10}$/.test(data.ci.replace(/\D/g, ''))) newErrors.ci = 'El CI debe tener entre 7 y 10 dígitos.';
    if (!data.area) newErrors.area = 'Selecciona un área.';
    if (!data.nivel) newErrors.nivel = 'Selecciona un nivel.';
    else if (!['Primaria', 'Secundaria'].includes(data.nivel)) newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".';

    // ✅ Validación de combinación area + nivel
    if (data.area && data.nivel) {
      const combinationExists = takenAreas.some(a => a.area === data.area && a.nivel === data.nivel);
      if (combinationExists) {
        newErrors.area = 'Ya existe un evaluador para esta combinación de área y nivel.';
      }
    }

    return newErrors;
  }, []);

  const submit = useCallback(async () => {
    const newErrors = validate(form, takenAreas);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return { ok: false, error: 'Por favor corrige los errores en el formulario.' };
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/evaluador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellidos: form.apellidos,
          correo: form.correo,
          telefono: form.telefono,
          ci: form.ci,
          area: form.area,
          nivel: form.nivel, // ✅ Enviar nivel
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
          return { ok: false, error: 'Algunos datos ya están registrados. Revisa los campos marcados.' };
        }
        throw new Error(data.message || 'Error al registrar');
      }
      return { ok: true, data };
    } catch (err) {
      console.error('Error en submit:', err);
      return { ok: false, error: 'No se pudo conectar con el servidor. Inténtalo más tarde.' };
    } finally {
      setSubmitting(false);
    }
  }, [form, takenAreas, validate]);

  return {
    form,
    setField,
    errors,
    submitting,
    submit,
    resetForm,
  };
}