// src/application/responsables/useEditResponsible.js
import { useState, useEffect, useCallback } from "react";
import { responsablesRepo } from "../../infrastructure/http/responsables/repository";
import { cleanNameInput, cleanPhoneInput, cleanCIInput } from "../../utils/text";
import { getAreasConNiveles } from "../../infrastructure/http/areas/areaRepostory";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

export function useEditResponsible(initial, open, takenAreas) {
    const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    ci: "",
    area: "",
  });
  ; // 🔹 Para comparar cambios
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [areasConNiveles, setAreasConNiveles] = useState({});

    useEffect(() => {
      const fetchAreas = async () => {
        try {
          const data = await getAreasConNiveles(); // devuelve tu JSON
          setAreasConNiveles(data);
        } catch (err) {
          console.error("Error al cargar áreas con niveles:", err);
        }
      };
      fetchAreas();
    }, []);
useEffect(() => {
    console.log("⚡ open:", open, "initial:", initial);
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
  }
}, [open, initial]);

  const setField = useCallback((key, val) => {
    let cleaned = val;
    if (key === 'nombre' || key === 'apellidos') {
      cleaned = cleanNameInput(val);
    } else if (key === 'telefono') {
      cleaned = cleanPhoneInput(val);
    } else if (key === 'ci') {
      cleaned = cleanCIInput(val);
    }
    setForm(prev => ({ ...prev, [key]: cleaned }));
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // ✅ Validación en tiempo real (igual que en registro)
  useEffect(() => {
    const newErrors = {};
    if (form.nombre && (form.nombre.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim()))) {
      newErrors.nombre = 'El nombre debe tener al menos 3 letras y solo puede contener letras.';
    }
    if (form.apellidos && (form.apellidos.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellidos.trim()))) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 3 letras y solo pueden contener letras.';
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

function obtenerIdArea(areas, nombreArea) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );

  if (!area) {
    return { error: `No se encontró el área "${nombreArea}".` };
  }

  return {
    id_area:area.id
  } // ✅ solo el id del área
}
  const submit = async () => {
    setSubmitting(true);

    // Validación completa (incluye unicidad)
    const fullErrors = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim())) {
      fullErrors.nombre = 'El nombre debe tener al menos 3 letras y solo puede contener letras.';
    }
    if (!form.apellidos.trim() || form.apellidos.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellidos.trim())) {
      fullErrors.apellidos = 'Los apellidos deben tener al menos 3 letras y solo pueden contener letras.';
    }
    if (!form.correo.trim()) {
      fullErrors.correo = 'El correo es obligatorio.';
    } else if (form.correo.length > 70) {
      fullErrors.correo = 'El correo no debe exceder los 70 caracteres.';
    } else if (!EMAIL_REGEX.test(form.correo)) {
      fullErrors.correo = 'El correo debe tener un formato válido (ej: nombre@dominio.com).';
    }
    if (!form.telefono) {
      fullErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^[67]\d{7}$/.test(form.telefono)) {
      fullErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    } 
    if (!form.ci) {
      fullErrors.ci = 'El CI es obligatorio.';
    } else if (!/^\d{6,10}$/.test(form.ci)) {
      fullErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    }
    if (!form.area) {
      fullErrors.area = 'Selecciona un área.';
    } 

    if (Object.keys(fullErrors).length > 0) {
      setErrors(fullErrors);
      setSubmitting(false);
      return { ok: false };
    }
   const  asignaciones = obtenerIdArea(areasConNiveles, form.area);
    try {
       const payload = {
        nombre: form.nombre,
        apellidos: form.apellidos,
        email: form.correo,
        telefono: form.telefono.replace(/\D/g, ""),
        ci: form.ci.replace(/\D/g, ""),
        asignaciones: [asignaciones],
      };
      console.log(payload);
      console.log(initial.id);
    
      const updated = await responsablesRepo.update(initial.id, payload);
      setSubmitting(false);
      return { ok: true, data: updated };
    } catch (err) {
        console.error("Error de red o servidor:", err);

      // ✅ Manejo de errores de validación del backend
      if (err.response && err.response.data?.errors) {
        const backendErrors = {};
        for (const [key, messages] of Object.entries(
          err.response.data.errors
        )) {
          // Mapear 'email' a 'correo' en tu formulario
          const fieldMap = { email: "correo", telefono: "telefono", ci: "ci" };
          const formField = fieldMap[key] || key;
          backendErrors[formField] = messages.join(" ");
        }
        setErrors(backendErrors);
      } else {
        setErrors({ general: "Error de conexión. Inténtalo más tarde." });
      }

      setSubmitting(false);
    }
    return changes;
  };

 /* const submit = async () => {
  setSubmitting(true);

  try {
    // 🔹 Obtener solo los campos modificados
    const payload = getChangedFields();

    // 🔹 Mapeo de campos para que coincidan con el backend
    if (payload.correo) {
      payload.email = payload.correo;
      delete payload.correo;
    }

    // 🔹 Normalizar teléfono
    if (payload.telefono) {
      payload.telefono = payload.telefono.replace(/\+591\s?/, "");
    }

    console.log("Campos modificados:", payload);

    // 🔹 Llamada al backend
    const updated = await responsablesRepo.update(initial.id, payload);

    // 🔹 Actualizar formulario original
    setOriginalForm({ ...updated });

    setSubmitting(false);
    return { ok: true, data: updated };
  } catch (err) {
    setSubmitting(false);

    // 🔹 Capturar errores de validación del backend
    if (err.response?.status === 422) {
      const validationErrors = err.response.data.errors || {};

      setErrors(
        Object.fromEntries(
          Object.entries(validationErrors).map(([field, msgs]) => [
            // si en el frontend lo usas como 'correo', mapea email → correo
            field === "email" ? "correo" : field,
            { ok: false, msg: msgs[0] },
          ])
        )
      );

      return { ok: false, error: "Errores de validación" };
    }

    // 🔹 Otros errores
    return {
      ok: false,
      error: err.response?.data?.message || "Error al actualizar",
    };
  }
}; */


  return { form, setField, errors, submitting, submit };
}
