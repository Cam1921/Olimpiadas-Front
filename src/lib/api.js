import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const saved = localStorage.getItem("token");
if (saved) {
  api.defaults.headers.common.Authorization = `Bearer ${saved}`;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      // opcional: redirigir al login
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
