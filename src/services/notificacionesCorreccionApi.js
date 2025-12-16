// src/services/api/notificacionesCorreccionApi.js

import { personaRepo } from "@/infrastructure/http/persona/repositorio";

// Luego lo cambias por tu apiClient real:
// import { apiClient } from "@/application/apiClient";

export async function getNotificacionesCorreccion() {
  const { data } = await personaRepo.getNotificaciones();   
  console.log("correcion de notificaciones",data);
  return data || {}; 
 /*  return [
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
 */
  // Versión real:
  // const { data } = await apiClient.get("/evaluador/notificaciones-correccion");
  // return data;
}

export async function marcarNotificacionComoLeida(id) {
  const { data } = await personaRepo.marcarLeidoNotificaciones(id);  
  console.log("Marcando notificación como leída:", id);
  return data || {};
  
}
