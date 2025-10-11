// src/infrastructure/evaluadores/repository.js
import api from "../../lib/api";

export const evaluadoresRepo = {
  async list() {
    const res = await api.get("/evaluador");
    return res.data;
  },
  async create(payload) {
    const res = await api.post("/evaluador", payload);
    return res.data.data;
  },
  async update(id, payload) {
    const res = await api.put(`/evaluador/${id}`, payload);
    return res.data.data;
  },
  async remove(id) {
    await api.delete(`/evaluador/${id}`);
  },
  async isEmailRegistered(email) {
    if (!email) return false;
    const res = await api.get(`/evaluador/check?field=correo&value=${encodeURIComponent(email)}`);
    return res.data.exists;
  },
  async isPhoneRegistered(phone) {
    if (!phone) return false;
    const res = await api.get(`/evaluador/check?field=telefono&value=${phone}`);
    return res.data.exists;
  },
  async isCIRegistered(ci) {
    if (!ci) return false;
    const res = await api.get(`/evaluador/check?field=ci&value=${ci}`);
    return res.data.exists;
  },
};