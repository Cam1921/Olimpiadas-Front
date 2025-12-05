import api from "@/lib/api";
 export const asignacionService ={
    async filtrarEvaluadores(params = {}) {
    try {
      const response = await api.get("/asignaciones/evaluadores", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
   async asignarCompetidores(data) {
    try {
      const response = await api.post("/asignaciones/asignar-competidores",data);
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
  async listarAsignaciones(params = {}) {
    try {
      const response = await api.get("/area-nivel",{params});
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
 async getEvaluadoresAsignacion(params = {}, idAreaNivel) {
  try {
    const response = await api.get(`/area-nivel/${idAreaNivel}/evaluadores`, { params });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }

},
async createAsignacion(data = {}, idAreaNivel) {
  try {
    const response = await api.post(`/area-nivel/${idAreaNivel}/asignaciones`,data );
    return response.data;
  } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }
},
async deleteAsignacion(data = {}, idAreaNivel) {
  try {
    const response = await api.delete(`/area-nivel/${idAreaNivel}/asignaciones`,{data} );
    return response.data;
  } catch (error) {
    console.error("Error al filtrar evaluaciones:", error);
    throw error.response?.data || error;
  }
}

 }