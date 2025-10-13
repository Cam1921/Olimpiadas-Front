// src/pages/dashboard/RoleIndexRedirect.jsx
import { Navigate } from "react-router-dom";
import { ROLE_NAMES } from "@/constants/menu";

export default function RoleIndexRedirect() {
  let role = ROLE_NAMES.ADMINISTRADOR;
  try {
    const raw = sessionStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    role = u?.role?.nombre || u?.rol?.nombre || ROLE_NAMES.ADMINISTRADOR;
  } catch {}

  if (role === ROLE_NAMES.EVALUADOR) return <Navigate to="informacion-personal" replace />;
  if (role === ROLE_NAMES.RESPONSABLE_DE_AREA) return <Navigate to="informacion-personal" replace />;

  // por defecto admin
  return <Navigate to="panel-principal" replace />;
}
