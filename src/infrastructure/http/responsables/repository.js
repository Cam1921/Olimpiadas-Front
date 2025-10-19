// src/infrastructure/responsables/repository.js
import api from "../../../lib/api";

export const responsablesRepo = {
  async list() {
    const res = await api.get("/responsable-academico");
    return res.data;
  },

  async create(payload) {
    const res = await api.post("/responsable-academico", payload);
    return res.data.data;
  },

  async update(id, payload) {
    const res = await api.put(`/responsable-academico/${id}`, payload);
    return res.data.data;
  },

  async remove(id) {
    await api.delete(`/responsable-academico/${id}`);
  },

  async isEmailRegistered(email, originalId = null) {
    if (!email) return false;
    const url = `/responsable-academico/check?field=correo&value=${encodeURIComponent(email)}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },

  async isPhoneRegistered(phone, originalId = null) {
    if (!phone) return false;
    const url = `/responsable-academico/check?field=telefono&value=${phone}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },

  async isCIRegistered(ci, originalId = null) {
    if (!ci) return false;
    const url = `/responsable-academico/check?field=ci&value=${ci}${originalId ? `&excludeId=${originalId}` : ''}`;
    const res = await api.get(url);
    return res.data.exists;
  },
};
