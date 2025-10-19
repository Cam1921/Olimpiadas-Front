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
  async getEvaluaciones(params = {}) {
    try {
      const response = await api.get(`/evaluador/evaluaciones`, {
        params: {
          perPage: params.perPage ?? 10,
          page: params.page ?? 1,
          busqueda: params.busqueda ?? "",
          estado_clasificado: params.estado_clasificado ?? "",
        },
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
      const response = await api.put(`evaluador/evaluaciones/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar evaluación:", error);
      throw error.response?.data || error;
    }
  },
};

export default EvaluacionesRepository;
