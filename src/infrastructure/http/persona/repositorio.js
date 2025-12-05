// src/infrastructure/http/persona/repository.js
import api from "../../../lib/api";

export const personaRepo = {
   async show(){
    const res = await api.get("/persona");
    return res.data;
  },

  async update(payload) {
    const res = await api.put("/persona", payload);
    return res.data;
  },
   async getNotificaciones() {
    try {
    const res = await api.get("/personas/notificaciones");
    return res.data;
     } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }
  },
  async sendNotificaciones(data={}) {
     try {
    const res = await api.post("/personas/notificaciones",data);
    return res.data;
     } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }
  },
   async marcarLeidoNotificaciones(idNotificacion) {
     try {
    const res = await api.put(`/personas/notificaciones/${idNotificacion}`);
    return res.data;
     } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }
  },
};
