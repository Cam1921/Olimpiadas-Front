import { useState, useEffect } from "react";
import axios from "../application/api"; // Ajusta la ruta según tu proyecto

export function useCorreccionNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Obtener notificaciones
  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/notificaciones/correccion");
      setNotificaciones(data || []);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal
  const abrirModal = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  // Enviar acción
  const enviarCorreccion = async (id, estado) => {
    try {
      await axios.post(`/notificaciones/correccion/${id}`, { estado });
      await fetchNotificaciones(); 
      cerrarModal();
    } catch (error) {
      console.error("Error al enviar corrección:", error);
    }
  };

  // Inicializar
  useEffect(() => {
    fetchNotificaciones();
  }, []);

  return {
    notificaciones,
    loading,
    selected,
    modalOpen,
    abrirModal,
    cerrarModal,
    enviarCorreccion,
  };
}

