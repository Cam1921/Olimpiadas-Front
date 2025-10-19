// src/infrastructure/evaluadores/repository.js
import api from "../../../lib/api";

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
  async isEmailRegistered(email, originalId = null) {
    if (!email) return false;
    const url = `/evaluador/check?field=correo&value=${encodeURIComponent(email)}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },
  async isPhoneRegistered(phone, originalId = null) {
    if (!phone) return false;
    const url = `/evaluador/check?field=telefono&value=${phone}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },
  async isCIRegistered(ci, originalId = null) {
    if (!ci) return false;
    const url = `/evaluador/check?field=ci&value=${ci}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },
};
