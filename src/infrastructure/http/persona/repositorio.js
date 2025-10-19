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
};
