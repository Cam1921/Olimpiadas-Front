// src/application/responsables/useRegisterResponsable.js
import { useState, useCallback, useEffect } from 'react';
import { getAreasConNiveles } from "../../infrastructure/http/areas/areaRepostory";
import api from "../../lib/api";

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
  const [allAreas, setAllAreas] = useState([]);

  const setField = useCallback((name, value) => {
    let cleaned = value;
    if (name === 'nombre' || name === 'apellidos') {
      cleaned = cleanNameInput(value);
    } else if (name === 'telefono') {
      cleaned = cleanPhoneInput(value);
    } else if (name === 'ci') {
      cleaned = cleanCIInput(value);
    }
    setForm(prev => ({ ...prev, [name]: cleaned }));
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
    setForm({ nombre: '', apellidos: '', correo: '', telefono: '', ci: '', area: '' });
    setErrors({});
  }, []);

  useEffect(() => {
    const newErrors = {};
    if (form.nombre && form.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (form.apellidos && form.apellidos.trim().length < 3) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 3 caracteres.';
    }
    if (form.correo) {
  const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail\.com|est\.umss\.edu)$/i.test(form.correo);
  if (!correoValido) {
    newErrors.correo = 'Solo se permiten correos @gmail.com o @est.umss.edu';
  }
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
    else if (data.nombre.trim().length < 3) newErrors.nombre = 'Mínimo 3 caracteres.';
    if (!data.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';
    else if (data.apellidos.trim().length < 3) newErrors.apellidos = 'Mínimo 3 caracteres.';
    if (!data.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
    } else if (data.correo.length > 70) {
      newErrors.correo = 'El correo no debe exceder los 70 caracteres.';
    } else if (!EMAIL_REGEX.test(data.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido (ej: nombre@dominio.com).';
    }
    if (!data.telefono) newErrors.telefono = 'El teléfono es obligatorio.';
    else if (!/^[67]\d{7}$/.test(data.telefono)) newErrors.telefono = '8 dígitos, inicia con 6 o 7.';
    if (!data.ci) newErrors.ci = 'El CI es obligatorio.';
    else if (!/^\d{6,10}$/.test(data.ci)) newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    if (!data.area) newErrors.area = 'Selecciona un área.';
    else if (takenAreas.includes(data.area)) newErrors.area = 'Esta área ya tiene un responsable asignado.';
    return newErrors;
  }, [takenAreas]);



  function obtenerIdArea(areas, nombreArea) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );

  if (!area) {
    return { error: `No se encontró el área "${nombreArea}".` };
  }

  return { id_area: area.id };
}
const submit = useCallback(async () => {
  // 🧩 1. Validar el formulario localmente
  const newErrors = validate(form, takenAreas);
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return { ok: false, error: "Corrige los errores" };
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
    if (key === "email") key = "correo"; // mapear a frontend
    backendErrors[key] = messages[0];
  });
  setErrors(backendErrors);
}

    // ⚠️ 4. Otros errores (conexión, 500, etc.)

    return { ok: false, error: "Error inesperado al registrar responsable académico." };

  } finally {
    // 🔁 5. Restablecer estado de envío
    setSubmitting(false);
  }
}, [form, takenAreas, validate, allAreas]);

  return { form, setField, errors, submitting, submit, resetForm };
}