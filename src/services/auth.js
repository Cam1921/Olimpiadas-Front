
import api from "../lib/api";

export async function login(email, password) {
  try {
    const { data } = await api.post("/login", { email, password });
 
    console.log(data);
    
    if (!data.token || !data.user) {
      throw new Error("Credenciales inválidas");
    }

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
