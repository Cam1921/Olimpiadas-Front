// src/services/api/notificacionesCorreccionApi.js

// Luego lo cambias por tu apiClient real:
// import { apiClient } from "@/application/apiClient";

export async function getNotificacionesCorreccion() {
  // Datos de prueba
  return [
    {
      id: 1,
      responsableNombre: "María González",
      responsableIniciales: "MG",
      competidorNombre: "Juan Pérez López",
      areaNombre: "Matemática",
      nivelNombre: "Secundaria",
      motivo: "La nota no coincide con el criterio del ítem 3.",
      tiempoRelativo: "Hace 10 min",
      leida: false,
    },
    {
      id: 2,
      responsableNombre: "Roberto Silva",
      responsableIniciales: "RS",
      competidorNombre: "Ana Torres Vega",
      areaNombre: "Física",
      nivelNombre: "Secundaria",
      motivo: "Falta justificación en la pregunta 2.",
      tiempoRelativo: "Hace 45 min",
      leida: false,
    },
  ];

  // Versión real:
  // const { data } = await apiClient.get("/evaluador/notificaciones-correccion");
  // return data;
}

export async function marcarNotificacionComoLeida(id) {
  console.log("Marcando notificación como leída:", id);

  // Versión real:
  // await apiClient.patch(`/evaluador/notificaciones-correccion/${id}/leer`);
}
