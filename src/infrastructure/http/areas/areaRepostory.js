// src/infrastructure/http/areas/areaRepostory.js
import api from "@/lib/api";

export async function getAreasConNiveles() {
  try {
    const response = await api.get("/catalogos/area-niveles");
    console.log("esto es la respuesta",response);
    return response.data.data; 

  } catch (error) {
    console.error("Error en getAreasConNiveles:", error);
    return [];
  }
}


