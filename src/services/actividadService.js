
import api from "@/lib/api";
 export const actividadService ={   
   async getAll(){    
      const res = await api.get(`/actividades`);
      return res.data;
   },
   async getById(id){
      const res = await api.get(`/actividades/${id}`);
      return res.data;
   },
   async update(id, data){
    
         const res = await api.put(`/actividades/${id}`, data);
         return res.data;     
   },   
   async porFase(faseId){
      const res = await api.get(`/fases/${faseId}/actividades`);
      return res.data;
   },
   async verificarActividad(nombreFase, nombreActividad){
      const res = await api.get(`/actividades/verificar/${encodeURIComponent(nombreFase)}/${encodeURIComponent(nombreActividad)}`);
      return res.data;
   },
   
 }
