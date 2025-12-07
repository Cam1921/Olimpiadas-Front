// src/infrastructure/http/Evaluacion/repository.js
import api from "@/lib/api";

const EvaluacionesRepository = {
  /**
   * Obtener evaluaciones del evaluador autenticado
   * (usa el ID desde el backend por Sanctum)
   *
   * @param {Object} params - filtros de búsqueda y paginación
   * @param {number} [params.perPage=10]
   * @param {number} [params.page=1]
   * @param {string} [params.busqueda]
   */
  async getEvaluaciones(params = {}, idAreaNivelFase) {
    try {
      const response = await api.get(`/evaluaciones/mis-evaluaciones/area-nivel-fase/${idAreaNivelFase}`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar evaluación por ID
   * @param {number} id - ID de la evaluación
   * @param {Object} data - datos a actualizar
   *   ejemplo: { nota: 80, descripcion: "Buena defensa", conducta: { respeto: true } }
   */
  async updateEvaluacion(id, data) {
    try {
      const response = await api.put(`/evaluaciones/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar evaluación:", error);
      throw error.response?.data || error;
    }
  },

 async otorgarAval(idAreaNivelFase) {
  try {
    const res = await api.post(`/evaluaciones/otorgar-aval/${idAreaNivelFase}`);
    return res.data; // ✅ ahora sí retornamos la respuesta correcta
  } catch (error) {
    console.error("Error al otorgar aval:", error);
    throw error.response?.data || error;
  }
},

  /**
   * 🔍 Filtrar evaluaciones por fase, área, nivel, búsqueda y estado clasificado
   * @param {Object} params - Filtros disponibles:
   * {
   *   id_fase?: number,
   *   id_area?: number,
   *   id_nivel?: number,
   *   busqueda?: string,
   *   estado_clasificado?: string,
   *   per_page?: number,
   *   page?: number
   * }
   */
  async filtrarEvaluaciones(params = {}) {
    try {
      const response = await api.get("/evaluaciones", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
  async exportClasificacionExcel(params = {}){
    try {
      const response = await api.get("evaluaciones/exportar", { params });
      consolg.lo(response);
      return response;
      
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },  
    async filtrarResultados(params = {}) {
    try {
      const response = await api.get("/resultados", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar evaluaciones:", error);
      throw error.response?.data || error;
    }
  },
};

export default EvaluacionesRepository;
