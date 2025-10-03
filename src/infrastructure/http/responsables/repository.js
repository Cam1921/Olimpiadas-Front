import { http } from "../http/client";

// Repositorio de responsables (front-only por ahora)
const MOCK_LIST = [
  { nombre:"María", apellidos:"González Pérez", correo:"maria.gonzalez@gmail.com",
    telefono:"+591 71234567", area:"Matemáticas", fecha:"2025-01-15" },
  { nombre:"Juan", apellidos:"Pérez López", correo:"juan.perez@gmail.com",
    telefono:"+591 72345678", area:"Física", fecha:"2025-01-20" },
];

export const responsablesRepo = {
  async list() {
    // ejemplo GET luego: await http.get("/responsables");
    return [...MOCK_LIST];
  },
  async create(payload) {
    // ejemplo POST luego: await http.post("/responsables", payload);
    return { ...payload, fecha: new Date().toISOString().slice(0,10) };
  },
  async isEmailRegistered(email) {
    // simula verificación (ajusta a backend real cuando esté)
    const existing = MOCK_LIST.map(x => x.correo.toLowerCase());
    return existing.includes(email.toLowerCase());
  }
};
