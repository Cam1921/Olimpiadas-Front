// src/pages/dashboard/notificaciones/hooks/useNotificaciones.js
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

export function useNotificaciones() {
  const [rows, setRows] = useState([]);
  const [kpis, setKpis] = useState({ total: 0, enviadasOK: 0, rebotadas: 0 });
  const [query, setQuery] = useState("");
  const [rol, setRol] = useState("Todos los roles");
  const [estado, setEstado] = useState("Todos los estados");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notificaciones/listar");
        const json = res.data;
        console.log(json);
        // Extraemos meta
        const meta = json.meta?.[0] || {};
        setKpis({
          total: meta.total || 0,
          enviadasOK: meta.enviadas_correctamente || 0,
          rebotadas: meta.fallidas || 0,
        });

        // Adaptamos los datos al formato de la tabla
        const dataArray = json.data?.[0] || [];
        const mapped = dataArray.map((item) => ({
          id: item.id,
          usuario: `${item.nombres} ${item.apellidos}`,
          correo: item.email,
          rol: item.rol.charAt(0).toUpperCase() + item.rol.slice(1),
          estado: item.estado,
          fechaEnvio: item.created_at,
          confirmado: item.usado,
          respuesta: null,
          proveedor: null,
          motivoFallo: null,
        }));
        console.log(mapped);
        setRows(mapped);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtros y búsqueda
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const byText =
        !q ||
        r.usuario.toLowerCase().includes(q) ||
        r.correo.toLowerCase().includes(q) ||
        r.rol.toLowerCase().includes(q);

      const byRol = rol === "Todos los roles" || r.rol === rol;
      const byEstado = estado === "Todos los estados" || r.estado === estado;

      return byText && byRol && byEstado;
    });
  }, [rows, query, rol, estado]);

  return {
    query,
    setQuery,
    rol,
    setRol,
    estado,
    setEstado,
    rows: filtered,
    kpis,
    loading,
  };
}
