// src/repositories/areaRepository.js

export async function getAreasConNiveles() {
  try {
    // Si tu backend devuelve este JSON desde una ruta, usa fetch:
    const response = await fetch('http://127.0.0.1:8000/api/catalogos/area-niveles');
    const json = await response.json();

    if (json.status === "success") {
      return json.data; // Devolvemos solo la parte útil
    } else {
      throw new Error("Error al obtener áreas y niveles");
    }
  } catch (error) {
    console.error("Error en getAreasConNiveles:", error);
    return [];
  }
}


