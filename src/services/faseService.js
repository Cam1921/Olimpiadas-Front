
import api from "@/lib/api";
 export const faseService ={  
   async getAll(){
      const res = await api.get(`/fases`);
      return res.data;
   },
   async getById(id){
      const res = await api.get(`/fases/${id}`);
      return res.data;
   },
   async update(id, data){
     
         const res = await api.put(`/fases/${id}`, data);
         return res.data;               
   },   
   async publicarTodo(){
      const res =  await api.post(`/fases/publicar-todo`);
      return res.data;
   },
   async getDropdown(){
      const res = await api.get(`/fases/dropdown`);
      return res.data;
   },
 }