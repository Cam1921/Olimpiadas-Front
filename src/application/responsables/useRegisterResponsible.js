// src/application/responsables/useRegisterResponsable.js
import { useState, useCallback, useEffect } from 'react';
import { getAreasConNiveles } from "../../infrastructure/http/areas/areaRepostory";
import api from "../../lib/api";
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
   const [allAreas, setAllAreas] = useState([]);

  // Al editar un campo, limpia su error
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

   useEffect(() => {   
      async function fetchAreas() {
        const areas = await getAreasConNiveles();
        setAllAreas(areas);
        console.log(areas);
      }
      fetchAreas();
    }, []);

  const resetForm = useCallback(() => {
    setForm({
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      ci: '',
      area: '',
    });
    setErrors({});
  }, []);


function obtenerIdArea(areas, nombreArea) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );

  if (!area) {
    return { error: `No se encontró el área "${nombreArea}".` };
  }

  return { id_area: area.id };
}
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

    setErrors(prev => {
      const updated = { ...prev, ...newErrors };
      // No elimina errores del backend innecesariamente
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
    else if (takenAreas.includes(data.area)) newErrors.area = 'Esta área ya tiene un responsable asignado.';

    return newErrors;
  }, []);



  
const submit = useCallback(async () => {
  // 🧩 1. Validar el formulario localmente
  const newErrors = validate(form, takenAreas);
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return { ok: false, error: "Por favor corrige los errores en el formulario." };
  }

  setSubmitting(true);
  const asignacion = obtenerIdArea(allAreas, form.area);

  try {
    // 📨 2. Enviar los datos al backend
    const response = await api.post("/responsable-academico", {
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.correo,
      telefono: form.telefono,
      ci: form.ci,
      asignaciones: [asignacion],
    });

    // ✅ Axios no necesita response.ok — si no es 2xx, lanza error automáticamente
    const data = response.data;

 
    return { ok: true, data };

  } catch (err) {
    console.error("❌ Error en submit:", err);

    // 🧾 3. Errores de validación del backend (422)
    if (err.response?.status === 422 && err.response.data?.errors) {
      const backendErrors = {};
      Object.entries(err.response.data.errors).forEach(([key, messages]) => {
        backendErrors[key] = messages[0];
      });
      setErrors(backendErrors);
    
      return { ok: false, error: "Errores de validación detectados." };
    }

    // ⚠️ 4. Otros errores (conexión, 500, etc.)

    return { ok: false, error: "Error inesperado al registrar responsable académico." };

  } finally {
    // 🔁 5. Restablecer estado de envío
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