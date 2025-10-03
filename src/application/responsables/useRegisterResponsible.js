import { useState } from "react";
import { responsablesRepo } from "../../infrastructure/responsables/repository";
import { validateResponsable } from "../../domain/responsables/validators";
import { newResponsable } from "../../domain/responsables/model";

export function useRegisterResponsible() {
  const [form, setForm] = useState(newResponsable());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validateAll = async () => {
    // consulta si correo existe (opcional por ahora)
    const registered = await responsablesRepo.isEmailRegistered(form.correo);
    const result = validateResponsable(form, { checkRegistered: true, registeredOK: registered });
    setErrors(result);
    const ok = Object.values(result).every(x => x.ok);
    return ok;
  };

  const submit = async () => {
    setSubmitting(true);
    const ok = await validateAll();
    if (!ok) { setSubmitting(false); return { ok: false }; }
    const payload = { ...form, telefono: `+591 ${form.telefono}` };
    const created = await responsablesRepo.create(payload);
    setSubmitting(false);
    return { ok: true, data: created };
  };

  return { form, setField, errors, setErrors, submitting, submit };
}
