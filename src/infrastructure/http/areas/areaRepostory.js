// src/infrastructure/http/areas/areaRepostory.js
import api from "@/lib/api";

export async function getAreasConNiveles() {
  try {
    const response = await api.get("catalogos/area-niveles");
    if (response.data.status === "success") {
      return response.data.data; // Suponiendo que los datos están en response.data.data
    } else {
      throw new Error("Error al obtener áreas y niveles");
    }
  } catch (error) {
    console.error("Error en getAreasConNiveles:", error);
    return [];
  }
}


