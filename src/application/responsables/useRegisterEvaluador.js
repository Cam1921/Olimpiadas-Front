// src/application/responsables/useRegisterEvaluador.js
import { useState, useCallback, useEffect } from 'react';
import api from "../../lib/api";

export function useRegisterEvaluador(takenAreas = [], areas = []) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ci: '',
    area: '',
    id_area: null,
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
      id_area: null,      
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
    if (form.correo) {
  const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail\.com|est\.umss\.edu)$/i.test(form.correo);
    if (!correoValido) {
    newErrors.correo = 'Solo se permiten correos @gmail.com o @est.umss.edu';
    }
    }
    if (form.telefono && !/^[67]\d{7}$/.test(form.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7. Ej: 71234567';
    }
    if (form.ci && !/^\d{6,10}$/.test(form.ci.replace(/\D/g, ''))) {
      newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos. Ej: 1234567';
    }
  /*   if (form.nivel && !['Primaria', 'Secundaria'].includes(form.nivel)) {
      newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".';
    } */
    setErrors(prev => {
      const updated = { ...prev, ...newErrors };
      return updated;
    });

   /*  // ✅ Validación flexible del nivel basada en el área
    if (form.nivel) {
      const nivelesValidos = getNivelesByArea(form.area);
      if (!nivelesValidos.includes(form.nivel)) {
        newErrors.nivel = `El nivel "${form.nivel}" no es válido para el área "${form.area}".`;
      }
    } */

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
    if (!data.id_area) newErrors.area = 'Selecciona un área.';
    
   /*  if (!data.nivel) newErrors.nivel = 'Selecciona un nivel.'; */
    /* else if (!['Primaria', 'Secundaria'].includes(data.nivel)) newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".'; */
    /* if (!data.nivel) {
      newErrors.nivel = 'Selecciona un nivel.';
    }  *//* else {
      // ✅ Validación flexible del nivel basada en el área
      const nivelesValidos = getNivelesByArea(data.area);
      if (!nivelesValidos.includes(data.nivel)) {
        newErrors.nivel = `El nivel "${data.nivel}" no es válido para el área "${data.area}".`;
      }
    } */

    // Verifica combinación única (área + nivel)
   

    return newErrors;
  }, []);
  
const submit = useCallback(async () => {
  const newErrors = validate(form);
  setErrors(newErrors);

  // ✅ Validación local antes de enviar
  if (Object.keys(newErrors).length > 0) {
    return { ok: false, error: "Por favor corrige los errores en el formulario." };
  }

  setSubmitting(true);
  try {
    // ✅ Axios ya agrega el token y baseURL automáticamente
    const response = await api.post("/evaluadores", {
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.correo,
      telefono: form.telefono,
      ci: form.ci,
      id_area: form.id_area,
    });

    // ✅ Axios lanza error si el status no es 2xx
    const data = response.data;
    console.log("Evaluador registrado:", data);
    return { ok: true, data };

  } catch (err) {
    
    // ⚙️ Si el backend devolvió errores de validación (422)
    if (err.response?.status === 422 && err.response.data?.errors) {
      const backendErrors = {};
      Object.entries(err.response.data.errors).forEach(([key, messages]) => {
    if (key === "email") key = "correo"; // mapear a frontend
    backendErrors[key] = messages[0];
  });
      setErrors(backendErrors);
      
      return { ok: false, error: "Errores de validación detectados." };
    }
  }finally {
    setSubmitting(false);
  }}, [form, validate]);

  return {
    form,
    setField,
    errors,
    submitting,
    submit,
    resetForm,
  };
}
