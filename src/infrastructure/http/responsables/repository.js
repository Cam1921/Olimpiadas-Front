import api from "../../lib/api";
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
  async isEmailRegistered(email) {
    if (!email) return false;
    const res = await api.get(`/responsable-academico/check?field=correo&value=${encodeURIComponent(email)}`);
    return res.data.exists;
  },
  async isPhoneRegistered(phone) {
    if (!phone) return false;
    const res = await api.get(`/responsable-academico/check?field=telefono&value=${phone}`);
    return res.data.exists;
  },
  async isCIRegistered(ci) {
    if (!ci) return false;
    const res = await api.get(`/responsable-academico/check?field=ci&value=${ci}`);
    return res.data.exists;
  },
};