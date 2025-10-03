import { MSG } from "./messages";

// Helpers
const isEmpty = (v) => !v || v.trim() === "";

// === Validación por campo (devuelve {ok:boolean, msg?:string}) ===
export const validateNombre = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.trim().length < 2) return { ok: false, msg: MSG.min2 };
  return { ok: true };
};

export const validateApellidos = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.trim().length < 2) return { ok: false, msg: MSG.min2 };
  return { ok: true };
};

export const validateCorreo = (v, opts = {}) => {
  const { checkRegistered = false, registeredOK = true } = opts;
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.length > 70) return { ok: false, msg: MSG.emailLen };
  const hasAt = v.includes("@");
  if (!hasAt) return { ok: false, msg: MSG.emailAt };
  const [user, domain] = v.split("@");
  if (!user || user.trim() === "") return { ok: false, msg: MSG.emailUser };
  if (!domain || domain.trim() === "") return { ok: false, msg: MSG.emailDomain };
  if (checkRegistered && !registeredOK) return { ok: false, msg: MSG.emailNotFound };
  return { ok: true };
};

export const validateTelefono = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (!/^(6|7)\d{7}$/.test(v)) return { ok: false, msg: MSG.phoneFormat };
  return { ok: true };
};

export const validateArea = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  return { ok: true };
};

// === Validación de formulario completo ===
export const validateResponsable = (r, opts) => ({
  nombre:    validateNombre(r.nombre),
  apellidos: validateApellidos(r.apellidos),
  correo:    validateCorreo(r.correo, opts),
  telefono:  validateTelefono(r.telefono),
  area:      validateArea(r.area),
});
