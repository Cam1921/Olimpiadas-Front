import api from "@/lib/api";
 export const estadoService ={
    async actualizarEstados() {
    try {
      const response = await api.get("/actualizar-estados");
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
 }