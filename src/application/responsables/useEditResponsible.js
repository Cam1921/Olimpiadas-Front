// src/application/responsables/EditResponsible.js
import { useState, useEffect } from "react";
import { responsablesRepo } from "../../infrastructure/http/responsables/repository";
import { validateResponsable } from "../../domain/responsables/validators";

export function useEditResponsible(initial, takenAreas) {
  const [form, setForm] = useState({ ...initial });
  const [originalForm, setOriginalForm] = useState({ ...initial }); // 🔹 Para comparar cambios
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({ ...initial });
      setOriginalForm({ ...initial });
    }
  }, [initial]);

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateAll = async () => {
    const result = await validateResponsable(
      form,
      responsablesRepo,
      takenAreas,
      initial?.area,
      initial?.id
    );
    setErrors(result);
    return Object.values(result).every((x) => x.ok);
  };

  const getChangedFields = () => {
    const changes = {};
    for (const key in form) {
      if (form[key] !== originalForm[key]) {
        changes[key] = form[key];
      }
    }
    return changes;
  };

 const submit = async () => {
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
};


  return { form, setField, errors, submitting, submit };
}
