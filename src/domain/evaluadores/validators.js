// src/domain/evaluadores/validators.js
import { MSG } from "./messages";

const isEmpty = (v) => !v || v.trim() === "";
const isLettersOnly = (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim());

export const validateNombre = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.trim().length < 2) return { ok: false, msg: MSG.min2 };
  if (!isLettersOnly(v)) return { ok: false, msg: MSG.lettersOnly };
  return { ok: true };
};

export const validateApellidos = validateNombre;

export const validateCorreo = async (v, repo) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: false, msg: MSG.emailFormat };
  const exists = await repo.isEmailRegistered(v);
  if (exists) return { ok: false, msg: MSG.emailExists };
  return { ok: true };
};

export const validateTelefono = async (v, repo) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (!/^(6|7)\d{7}$/.test(v)) return { ok: false, msg: MSG.phoneFormat };
  const exists = await repo.isPhoneRegistered(v);
  if (exists) return { ok: false, msg: MSG.phoneExists };
  return { ok: true };
};

export const validateCI = async (v, repo) => {
  if (!v || v.trim() === "") return { ok: false, msg: MSG.ciRequired };
  if (!/^\d{6,10}$/.test(v)) return { ok: false, msg: MSG.ciFormat };
  const exists = await repo.isCIRegistered(v);
  if (exists) return { ok: false, msg: MSG.ciExists };
  return { ok: true };
};

export const validateArea = (v, takenAreas, originalArea = null, originalNivel = null) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.areaRequired };

  // Si el área no cambió, no validamos la combinación
  if (v === originalArea) {
    return { ok: true };
  }

  // Verifica si la combinación (area, nivel) ya existe en takenAreas
  const combinationExists = takenAreas.some(a =>
    a.area === v && a.nivel === originalNivel
  );

  if (combinationExists) {
    return { ok: false, msg: "Ya existe un evaluador para esta combinación de área y nivel." };
  }

  return { ok: true };
};

export const validateNivel = (v) => {
  if (isEmpty(v)) return { ok: false, msg: "Completa este campo" };
  if (!["Primaria", "Secundaria"].includes(v)) return { ok: false, msg: "El nivel debe ser 'Primaria' o 'Secundaria'" };
  return { ok: true };
};

export const validateEvaluador = async (form, repo, takenAreas, originalArea = null, originalNivel = null) => {
  // Filtra las áreas tomadas para excluir la combinación original si está siendo editada
  const areaList = takenAreas.filter(a => 
    !(a.area === originalArea && a.nivel === originalNivel)
  );

  return {
    nombre: validateNombre(form.nombre),
    apellidos: validateApellidos(form.apellidos),
    correo: await validateCorreo(form.correo, repo),
    telefono: await validateTelefono(form.telefono, repo),
    ci: await validateCI(form.ci, repo),
    area: validateArea(form.area, areaList, originalArea, originalNivel), // ✅ Pasa el nivel original
    nivel: validateNivel(form.nivel),
  };
};