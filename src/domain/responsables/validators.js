// src/domain/responsables/validators.js
import { MSG } from "./messages";

const isEmpty = (v) => !v || v.trim() === "";
const isLettersOnly = (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim());

export const validateNombre = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.trim().length < 3) return { ok: false, msg: MSG.min3 };
  if (!isLettersOnly(v)) return { ok: false, msg: MSG.lettersOnly };
  return { ok: true };
};

export const validateApellidos = validateNombre;

export const validateCorreo = async (v, repo, originalId = null) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
  if (!EMAIL_REGEX.test(v)) return { ok: false, msg: MSG.emailFormat };
  const exists = await repo.isEmailRegistered(v, originalId);
  if (exists) return { ok: false, msg: MSG.emailExists };
  return { ok: true };
};

export const validateTelefono = async (v, repo, originalId = null) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (!/^(6|7)\d{7}$/.test(v)) return { ok: false, msg: MSG.phoneFormat };
  const exists = await repo.isPhoneRegistered(v, originalId);
  if (exists) return { ok: false, msg: MSG.phoneExists };
  return { ok: true };
};

export const validateCI = async (v, repo, originalId = null) => {
  if (!v || v.trim() === "") return { ok: false, msg: MSG.ciRequired };
  if (!/^\d{6,10}$/.test(v)) return { ok: false, msg: MSG.ciFormat };
  const exists = await repo.isCIRegistered(v, originalId);
  if (exists) return { ok: false, msg: MSG.ciExists };
  return { ok: true };
};

export const validateArea = (v, takenAreas) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.areaRequired };
  if (takenAreas.includes(v)) return { ok: false, msg: MSG.areaTaken };
  return { ok: true };
};

export const validateResponsable = async (form, repo, takenAreas, originalArea = null, originalId = null) => {
  const areaList = form.area !== originalArea 
    ? takenAreas.filter(a => a !== originalArea) 
    : takenAreas;

  return {
    nombre: validateNombre(form.nombre),
    apellidos: validateApellidos(form.apellidos),
    correo: await validateCorreo(form.correo, repo, originalId),
    telefono: await validateTelefono(form.telefono, repo, originalId),
    ci: await validateCI(form.ci, repo, originalId),
    area: validateArea(form.area, areaList),
  };
};