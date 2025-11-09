// src/lib/api.js
import axios from "axios";
import { API_URL } from "../config";

const baseURL = (API_URL || "").replace(/\/+$/, "");
const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // 👈 ¡ES CLAVE!
});

// ❌ Elimina completamente el interceptor de Authorization

export default api;