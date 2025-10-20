// src/domain/evaluadores/validators.js
import { MSG } from "./messages";
import { getNivelesByArea } from "../../utils/areaUtils";

const isEmpty = (v) => !v || v.trim() === "";
const isLettersOnly = (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim());

export const validateNombre = (v) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (v.trim().length < 3) return { ok: false, msg: MSG.min4 }; // Usa MSG.min4 aunque diga "3 caracteres"
  if (!isLettersOnly(v)) return { ok: false, msg: MSG.lettersOnly };
  return { ok: true };
};

export const validateApellidos = validateNombre;

export const validateCorreo = async (v, repo, originalId = null) => {
  if (isEmpty(v)) return { ok: false, msg: MSG.required };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: false, msg: MSG.emailFormat };
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

export const validateNivel = (v, area) => {
  if (isEmpty(v)) return { ok: false, msg: "Selecciona un nivel" };
  const nivelesValidos = getNivelesByArea(area);
  if (!nivelesValidos.includes(v)) {
    return { ok: false, msg: `El nivel "${v}" no es válido para el área "${area}"` };
  }
  return { ok: true };
};

export const validateEvaluador = async (form, repo, takenAreas, originalArea = null, originalNivel = null, originalId = null) => {
  // Filtra las áreas tomadas para excluir la combinación original si está siendo editada
  const areaList = takenAreas.filter(a => 
    !(a.area === originalArea && a.nivel === originalNivel)
  );

  return {
    nombre: validateNombre(form.nombre),
    apellidos: validateApellidos(form.apellidos),
    correo: await validateCorreo(form.correo, repo, originalId),
    telefono: await validateTelefono(form.telefono, repo, originalId),
    ci: await validateCI(form.ci, repo, originalId),
    area: validateArea(form.area, areaList, originalArea, originalNivel),
    nivel: validateNivel(form.nivel, form.area),
  };
};