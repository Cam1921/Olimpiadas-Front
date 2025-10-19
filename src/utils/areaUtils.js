// src/utils/areaUtils.js

// ✅ Define los niveles específicos para cada área
export const NIVELES_POR_AREA = {
  "Astronomía - Astrofísica": ["3ro Primaria", "4to Primaria", "5to Primaria", "6to Primaria", "1ro Secundaria", "2do Secundaria", "3ro Secundaria", "4to Secundaria", "5to Secundaria", "6to Secundaria"],
  "Biología": ["3ro Primaria", "4to Primaria", "5to Primaria", "6to Primaria", "1ro Secundaria", "2do Secundaria", "3ro Secundaria", "4to Secundaria", "5to Secundaria", "6to Secundaria"],
  "Física": ["3ro Primaria", "4to Primaria", "5to Primaria", "6to Primaria", "1ro Secundaria", "2do Secundaria", "3ro Secundaria", "4to Secundaria", "5to Secundaria", "6to Secundaria"],
  "Informática": ["Guacamo", "Guanaco", "Londra", "Jucumari", "Bufo", "Puma"],
  "Matemáticas": ["Primer Nivel", "Segundo Nivel", "Tercer Nivel", "Cuarto Nivel", "Quinto Nivel", "Sexto Nivel"],
  "Química": ["2do Secundaria", "3ro Secundaria", "4to Secundaria", "5to Secundaria", "6to Secundaria"],
  "Robótica": ["Builders P", "Builders S", "Lego P", "Lego S"],
};

// ✅ Obtiene los niveles disponibles para un área
export const getNivelesByArea = (area) => {
  return NIVELES_POR_AREA[area] || [];
};

// ✅ Verifica si un área está "completa" (todos sus niveles están asignados)
export const isAreaCompleta = (area, takenAreas) => {
  const nivelesArea = getNivelesByArea(area);
  if (nivelesArea.length === 0) return false;

  const asignados = takenAreas
    .filter(a => a.area === area)
    .map(a => a.nivel);

  return nivelesArea.every(nivel => asignados.includes(nivel));
};