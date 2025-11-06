// Áreas visibles en el dropdown
// ===== Áreas visibles en el dropdown =====
export const AREAS = [
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Informática",
  "Astronomía - Astrofísica",
  "Robótica",
];

// ===== Mapa canónico: Área → Niveles =====
export const LEVELS_BY_AREA = {
  "Matemáticas": [
    "Primer Nivel",
    "Segundo Nivel",
    "Tercer Nivel",
    "Cuarto Nivel",
    "Quinto Nivel",
    "Sexto Nivel",
  ],
  "Física": [
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ],
  "Química": [
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ],
  "Biología": [
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ],
  "Informática": ["Guacamayo", "Guanaco", "Londra", "Jucumari", "Bufeo", "Puma"],
  "Astronomía - Astrofísica": [
    "3ro Primaria",
    "4to Primaria",
    "5to Primaria",
    "6to Primaria",
    "1ro Secundaria",
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ],
  "Robótica": ["Builders P", "Builders S", "Lego P", "Lego S"],
};

// ===== Normalización robusta (tolerante a acentos/espacios) =====
const normalize = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const LEVELS_BY_AREA_INDEX = Object.fromEntries(
  Object.entries(LEVELS_BY_AREA).map(([k, v]) => [normalize(k), v])
);

// Obtiene niveles para el área elegida (encabezado “Todos los niveles” incluido)
export const getLevelsForArea = (area) => {
  if (!area || area === "Todas las áreas") return ["Todos los niveles"];
  if (LEVELS_BY_AREA[area]) return ["Todos los niveles", ...LEVELS_BY_AREA[area]];
  const found = LEVELS_BY_AREA_INDEX[normalize(area)];
  return ["Todos los niveles", ...(found || [])];
};

// ===== Helpers para saber si un área tiene Primaria / Secundaria =====
export const areaHasPrimaria = (area) =>
  (LEVELS_BY_AREA[area] || []).some((n) =>
    /Primaria|Builders P|Lego P|Guacamayo/i.test(n)
  );

export const areaHasSecundaria = (area) =>
  (LEVELS_BY_AREA[area] || []).some((n) =>
    /Secundaria|Builders S|Lego S|Nivel|Guanaco|Londra|Jucumari|Bufeo|Puma/i.test(n)
  );

// ===== Datos mock (idénticos a tu tabla del mockup) =====
export const COMPETIDORES = [
  {
    id: "1",
    nombre: "Ana María Rodríguez",
    area: "Matemáticas",
    nivel: "Sexto Nivel",
    puntaje: 85,
    estado: "Clasificado",
  },
  {
    id: "2",
    nombre: "Carlos Pérez López",
    area: "Física",
    nivel: "4to Secundaria",
    puntaje: 92,
    estado: "Clasificado",
  },
  {
    id: "3",
    nombre: "María González",
    area: "Química",
    nivel: "2do Secundaria",
    puntaje: 78,
    estado: "Clasificado",
  },
  {
    id: "4",
    nombre: "Juan Mamani",
    area: "Informática",
    nivel: "Guacamayo",
    puntaje: 65,
    estado: "No Clasificado",
  },
  {
    id: "5",
    nombre: "Sofía Quispe",
    area: "Biología",
    nivel: "3ro Secundaria",
    puntaje: 45,
    estado: "Descalificado",
  },
  {
    id: "6",
    nombre: "Luis Torrez",
    area: "Astronomía - Astrofísica",
    nivel: "1ro Secundaria",
    puntaje: 88,
    estado: "Clasificado",
  },
];






