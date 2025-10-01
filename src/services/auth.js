// src/services/auth.js
import api from "../lib/api";

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function me() {
  const { data } = await api.get("/me");
  sessionStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function logout() {
  try {
    await api.post("/logout");
  } finally {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }
}
