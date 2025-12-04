// src/hooks/useCorreccionNotificaciones.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotificacionesCorreccion,
  marcarNotificacionComoLeida,
} from "@/services/notificacionesCorreccionApi";

// Contexto
const CorreccionNotificacionesContext = createContext(null);

export function CorreccionNotificacionesProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // controla el modal
  const [toastMessage, setToastMessage] = useState(null); // mensaje del toast
  const navigate = useNavigate();

  // Cargar notificaciones al montar
  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const data = await getNotificacionesCorreccion();
      setNotificaciones(data || []);
    } catch (error) {
      console.error("Error cargando notificaciones de corrección:", error);
    }
  };

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleClickNotificacion = async (notificacion) => {
    try {
      setToastMessage("Redirigiendo a la corrección de notas...");

      // marcar como leída en backend
      await marcarNotificacionComoLeida(notificacion.id);

      // actualizar en memoria
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === notificacion.id ? { ...n, leida: true } : n
        )
      );

      // TODO: ajusta esta ruta a tu pantalla real de registro de notas
      navigate("/dashboard/registrar-notas", {
        state: { fromNotificationId: notificacion.id },
      });

      setTimeout(() => setToastMessage(null), 2500);
    } catch (error) {
      console.error("Error al abrir notificación:", error);
      setToastMessage("Ocurrió un error al abrir la notificación.");
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const value = {
    notificaciones,
    unreadCount,
    isOpen,
    openModal,
    closeModal,
    handleClickNotificacion,
    toastMessage,
  };

  return (
    <CorreccionNotificacionesContext.Provider value={value}>
      {children}
    </CorreccionNotificacionesContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCorreccionNotificaciones() {
  const ctx = useContext(CorreccionNotificacionesContext);
  if (!ctx) {
    throw new Error(
      "useCorreccionNotificaciones debe usarse dentro de CorreccionNotificacionesProvider"
    );
  }
  return ctx;
}



