// src/application/evaluadores/useRegisterEvaluador.js
import { useState, useCallback, useEffect } from 'react';
import { AREAS } from '../../services/areas';
import { getNivelesByArea } from '../../utils/areaUtils'; // 👈 Importa la función

export function useRegisterEvaluador(takenAreas = []) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ci: '',
    area: '',
    nivel: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      nivel: '',
    });
    setErrors({});
  }, []);

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
    if (form.ci && !/^\d{6,10}$/.test(form.ci.replace(/\D/g, ''))) {
      newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos. Ej: 1234567';
    }

    // ✅ Validación flexible del nivel basada en el área
    if (form.nivel) {
      const nivelesValidos = getNivelesByArea(form.area);
      if (!nivelesValidos.includes(form.nivel)) {
        newErrors.nivel = `El nivel "${form.nivel}" no es válido para el área "${form.area}".`;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
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
    else if (!/^\d{6,10}$/.test(data.ci.replace(/\D/g, ''))) newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    if (!data.area) newErrors.area = 'Selecciona un área.';
    if (!data.nivel) {
      newErrors.nivel = 'Selecciona un nivel.';
    } else {
      // ✅ Validación flexible del nivel basada en el área
      const nivelesValidos = getNivelesByArea(data.area);
      if (!nivelesValidos.includes(data.nivel)) {
        newErrors.nivel = `El nivel "${data.nivel}" no es válido para el área "${data.area}".`;
      }
    }

    // Verifica combinación única (área + nivel)
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
          nivel: form.nivel,
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