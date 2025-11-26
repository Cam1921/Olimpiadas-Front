
import api from "@/lib/api";
 export const actividadService ={

   
   async getAll(){
      // 🔧 Descomenta esto para modo de desarrollo sin backend
    /*
    return {
      data: [
        {
          id: 1,
          nombre: "Inscripción",
          fase: "Fase 1",
          descripcion: "Periodo de inscripción para equipos",
          fecha_inicio: "2025-12-01T09:00:00Z",
          fecha_fin: "2025-12-05T18:00:00Z",
          hora_inicio_ini: "09:00",
          hora_fin_ini: "18:00",
          hora_inicio_fin: "09:00",
          hora_fin_fin: "18:00",
          estado_publicado: "borrador",
          fase_id: 1
        }
      ]
    };
    */
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
