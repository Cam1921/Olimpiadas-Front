// src/infrastructure/http/entornoFinal/repository.js
import api from "../../../lib/api";

export const entornoFinalRepo = {
  async listAreasConNiveles() {
    const res = await api.get("/entorno-final/niveles");
    return res.data;
  },
  async preparaEntornoFinal(idAreaNivelFase){
   const res = await api.post(`/entorno-final/preparar/${idAreaNivelFase}`);
   console.log(res);
   return res;
    
  }
}