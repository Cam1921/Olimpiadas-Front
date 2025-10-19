// src/application/useEditEvaluador.js
import { useState, useEffect } from "react";
import { evaluadoresRepo } from "../infrastructure/evaluadores/repository";
import { validateEvaluador } from "../domain/evaluadores/validators";

export function useEditEvaluador(initial, takenAreas) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...initial });
  }, [initial]);

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validateAll = async () => {
    const result = await validateEvaluador(
      form,
      evaluadoresRepo,
      takenAreas,
      initial?.area,
      initial?.nivel // ✅ Pasamos el nivel original
    );
    setErrors(result);
    return Object.values(result).every(x => x.ok);
  };

  const submit = async () => {
    setSubmitting(true);
    const ok = await validateAll();
    if (!ok) { setSubmitting(false); return { ok: false }; }
    try {
      const payload = {
        ...form,
        telefono: form.telefono.replace(/\+591\s?/, ""),
      };
      const updated = await evaluadoresRepo.update(initial.id, payload);
      setSubmitting(false);
      return { ok: true, data: updated };
    } catch (err) {
      setSubmitting(false);
      return { ok: false, error: err.response?.data?.message || "Error al actualizar" };
    }
  };

  return { form, setField, errors, submitting, submit };
}