import api, { setAuthToken } from "../lib/api";

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  setAuthToken(data.token);      // guarda token
  return data.user;              // retorna usuario
}

export async function me() {
  // usa /me; si en tu backend aún está pendiente, cambia temporalmente a /me-test
  const { data } = await api.get("/me");
  return data;
}

export async function logout() {
  try { await api.post("/logout"); } catch {}
  setAuthToken(null);
}
