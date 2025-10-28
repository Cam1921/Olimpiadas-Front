// src/pages/dashboard/notificaciones/hooks/useNotificaciones.js
import { useMemo, useState } from "react";

const RAW = [
  {
    id: 1,
    usuario: "María González",
    correo: "maria.gonzalez@example.com",
    rol: "Responsable",
    estado: "Confirmado",              // 🟢
    fechaEnvio: "2025-10-24T09:15:00-04:00",
    confirmado: true,
    respuesta: "250 OK – Message accepted",
    proveedor: "SMTP",
    motivoFallo: null,
  },
  {
    id: 2,
    usuario: "Ana Martínez",
    correo: "ana.martinez@example.com",
    rol: "Evaluador",
    estado: "Pendiente",               // 🟡
    fechaEnvio: "2025-10-24T10:30:00-04:00",
    confirmado: false,
    respuesta: "250 OK – Message accepted",
    proveedor: "SMTP",
    motivoFallo: null,
  },
  {
    id: 3,
    usuario: "Carlos Rodríguez",
    correo: "carlos.rodriguez@invalid",
    rol: "Evaluador",
    estado: "Rebotado",                // 🔴
    fechaEnvio: "2025-10-24T11:00:00-04:00",
    confirmado: false,
    respuesta: "550 Error – Invalid address",
    proveedor: "SMTP",
    motivoFallo: "Dirección de correo electrónico inválida",
  },
];

export function useNotificaciones() {
  const [query, setQuery] = useState("");
  const [rol, setRol] = useState("Todos los roles");
  const [estado, setEstado] = useState("Todos los estados");
  const [rows] = useState(RAW);

  // KPIs globales (no cambian con el filtro)
  const kpis = useMemo(() => {
    const total = rows.length;
    const enviadasOK = rows.filter(r => r.estado === "Confirmado" || r.estado === "Pendiente").length;
    const rebotadas = rows.filter(r => r.estado === "Rebotado").length;
    return { total, enviadasOK, rebotadas };
  }, [rows]);

  // Filtro + búsqueda
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      const byText = !q ||
        r.usuario.toLowerCase().includes(q) ||
        r.correo.toLowerCase().includes(q) ||
        r.rol.toLowerCase().includes(q);

      const byRol = rol === "Todos los roles" || r.rol === rol;

      const byEstado =
        estado === "Todos los estados" ||
        r.estado === estado;

      return byText && byRol && byEstado;
    });
  }, [rows, query, rol, estado]);

  return {
    query, setQuery,
    rol, setRol,
    estado, setEstado,
    rows: filtered,
    kpis,
  };
}
