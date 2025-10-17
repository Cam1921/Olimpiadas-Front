// src/application/evaluadores/useRegisterEvaluador.js
import { useState, useCallback, useEffect } from 'react';
import { getAreasConNiveles } from "../../infrastructure/http/areas/areaRepostory";
import api from "../../lib/api";

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
   const [allAreas, setAllAreas] = useState([]);

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
      nivel: '', 
    });
    setErrors({});
  }, []);

    useEffect(() => {
     
      async function fetchAreas() {
        const areas = await getAreasConNiveles();
        setAllAreas(areas);
        console.log(areas);
      }
      fetchAreas();
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
  /*   if (form.nivel && !['Primaria', 'Secundaria'].includes(form.nivel)) {
      newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".';
    } */
    setErrors(prev => {
      const updated = { ...prev, ...newErrors };
      return updated;
    });
  }, [form]);


  function obtenerIds(areas, nombreArea, nombreNivel) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );

  if (!area) {
    return { error: `No se encontró el área "${nombreArea}".` };
  }

  const nivel = area.niveles.find(
    (n) => n.nombre_nivel.toLowerCase() === nombreNivel.toLowerCase()
  );

  if (!nivel) {
    return { error: `No se encontró el nivel "${nombreNivel}" en el área "${nombreArea}".` };
  }

  return { id_area: area.id, id_nivel: nivel.id };
}
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
    /* else if (!['Primaria', 'Secundaria'].includes(data.nivel)) newErrors.nivel = 'El nivel debe ser "Primaria" o "Secundaria".'; */

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

  // ✅ Validación local antes de enviar
  if (Object.keys(newErrors).length > 0) {
    return { ok: false, error: "Por favor corrige los errores en el formulario." };
  }

  setSubmitting(true);
  const asignacion = obtenerIds(allAreas, form.area, form.nivel);

  try {
    // ✅ Axios ya agrega el token y baseURL automáticamente
    const response = await api.post("/evaluador", {
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.correo,
      telefono: form.telefono,
      ci: form.ci,
      asignaciones: [asignacion],
    });

    // ✅ Axios lanza error si el status no es 2xx
    const data = response.data;
    
    return { ok: true, data };

  } catch (err) {
    console.error("Error en submit:", err);

    // ⚙️ Si el backend devolvió errores de validación (422)
    if (err.response?.status === 422 && err.response.data?.errors) {
      const backendErrors = {};
      Object.entries(err.response.data.errors).forEach(([key, messages]) => {
        backendErrors[key] = messages[0];
      });
      setErrors(backendErrors);
      
      return { ok: false, error: "Errores de validación detectados." };
    }

    // ⚙️ Otros errores (500, conexión, etc.)
    
    return { ok: false, error: "Error inesperado al registrar." };

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