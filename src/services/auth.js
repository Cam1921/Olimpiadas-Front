// src/services/auth.js
import api from "../lib/api";
import { ROLE_NAMES } from "@/constants/menu";

// Mapea el texto del selector de rol en el modal a tu enum real
const ROLE_LABEL_TO_VALUE = {
  "Administrador": ROLE_NAMES.ADMINISTRADOR,
  "Evaluador": ROLE_NAMES.EVALUADOR,
  "Responsable de área": ROLE_NAMES.RESPONSABLE_DE_AREA,
};

const FAKE_USERS = {
  [ROLE_NAMES.ADMINISTRADOR]: {
    id: 1,
    email: "admin@nebula.com",
    nombre: "Admin Demo",
    role: { nombre: ROLE_NAMES.ADMINISTRADOR },
  },
  [ROLE_NAMES.EVALUADOR]: {
    id: 2,
    email: "eval@nebula.com",
    nombre: "Evaluador Demo",
    role: { nombre: ROLE_NAMES.EVALUADOR },
  },
  [ROLE_NAMES.RESPONSABLE_DE_AREA]: {
    id: 3,
    email: "resp@nebula.com",
    nombre: "Responsable Demo",
    role: { nombre: ROLE_NAMES.RESPONSABLE_DE_AREA },
  },
};

function fakeLogin(email, password, roleLabel) {
  // Puedes validar mínimamente email/pass si quieres
  const roleName = ROLE_LABEL_TO_VALUE[roleLabel] || ROLE_NAMES.ADMINISTRADOR;
  const user = { ...FAKE_USERS[roleName], email: email || FAKE_USERS[roleName].email };
  const data = { token: "DEV_FAKE_TOKEN", user };
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("user", JSON.stringify(data.user));
  return Promise.resolve(data);
}

export async function login(email, password, roleLabel = "Administrador") {
  // 🧪 modo mock
  if (import.meta.env.VITE_FAKE_AUTH === "true") {
    return fakeLogin(email, password, roleLabel);
  }

  // 🔌 modo real (cuando conectes backend)
  try {
    const { data } = await api.post("/login", { email, password });
    if (!data.token || !data.user) throw new Error("Credenciales inválidas");
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : new Error("Credenciales inválidas");
  }
}

export async function me() {
  if (import.meta.env.VITE_FAKE_AUTH === "true") {
    // devolver lo que ya guardaste
    const u = sessionStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  }
  const { data } = await api.get("/me");
  sessionStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function logout() {
  try {
    if (import.meta.env.VITE_FAKE_AUTH !== "true") {
      await api.post("/logout");
    }
  } finally {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }
}
