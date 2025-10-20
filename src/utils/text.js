// src/utils/text.js

// Solo letras, espacios, tildes y ñ (nombre y apellidos)
export const cleanNameInput = (value) => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

// Solo dígitos (para teléfono y CI)
export const cleanDigitsOnly = (value) => {
  return value.replace(/\D/g, '');
};

// Limpia teléfono: solo 8 dígitos
export const cleanPhoneInput = (value) => {
  return cleanDigitsOnly(value).slice(0, 8);
};

// Limpia CI: entre 6 y 10 dígitos
export const cleanCIInput = (value) => {
  return cleanDigitsOnly(value).slice(0, 10);
};
