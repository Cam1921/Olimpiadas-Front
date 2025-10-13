// src/domain/evaluadores/messages.js
export const MSG = {
  required: "Completa este campo",
  min4: "Mínimo 4 caracteres",
  lettersOnly: "Solo letras y espacios permitidos",
  emailFormat: "El correo debe tener un formato válido (ej. nombre@dominio.com)",
  emailExists: "Este correo ya está registrado",
  phoneFormat: "Formato: 8 dígitos, inicia con 6 o 7",
  phoneExists: "Este número ya está registrado",
  ciRequired: "El CI es obligatorio",
  ciFormat: "El CI debe tener entre 6 y 10 dígitos",
  ciExists: "Este CI ya está registrado",
  areaRequired: "Selecciona un área",
  areaTaken: "Esta área ya está asignada",
  // Nivel (no estaba en el original de responsable, lo agregamos aquí)
  nivelRequired: "Selecciona un nivel",
  nivelInvalid: "El nivel debe ser 'Primaria' o 'Secundaria'",
};