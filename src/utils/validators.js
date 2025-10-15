// src/utils/validators.js
export function validateNombre(v) {
  const value = (v ?? "").trim();
  if (value.length === 0) return "El nombre debe tener al menos 3 caracteres.";
  if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  if (value.length > 50) return "El nombre no puede superar los 50 caracteres.";
  const invalidChars = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/;
  if (invalidChars.test(value)) return "El nombre solo puede contener letras y espacios";
  if (/\s{2,}/.test(value)) return "El nombre no debe contener más de un espacio entre palabras";
  return "";
}

// 👉 recorta a 8 y elimina no-dígitos
export function formatTelefonoInput(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  return digits.slice(0, 8);
}

export function validateTelefono(v) {
  const value = String(v ?? "");
  if (!value) return ""; // sin escribir, sin error

  // primer dígito 6 o 7
  if (value.length >= 1 && !/^[67]/.test(value[0])) {
    return "Debe comenzar con 6 o 7";
  }
  // sólo dígitos y longitud exacta 8 para considerarlo válido
  if (!/^\d+$/.test(value) || value.length !== 8) {
    return "Formato inválido: solo se permiten 8 números";
  }
  return "";
}

export function validatePassword(v) {
  const value = v ?? "";
  if (!value) {
    // cuando no ha escrito nada, el componente decide si mostrar o no
    return "La contraseña debe ser de mínimo 8, máximo 25 caracteres, contener al menos una letra mayúscula y un número";
  }
  if (value.length < 8 || value.length > 25) {
    return "La contraseña debe ser de mínimo 8, máximo 25 caracteres, contener al menos una letra mayúscula y un número";
  }
  if (!/[A-Z]/.test(value) || !/\d/.test(value)) {
    return "La contraseña debe ser de mínimo 8, máximo 25 caracteres, contener al menos una letra mayúscula y un número";
  }
  return "";
}

export function validatePasswordConfirm(pass, confirm) {
  if ((confirm ?? "").length === 0) return "La contraseña no coincide";
  if (pass !== confirm) return "La contraseña no coincide";
  return "";
}
