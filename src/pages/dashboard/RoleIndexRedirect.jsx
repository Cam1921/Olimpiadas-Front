// src/pages/dashboard/RoleIndexRedirect.jsx
import { Navigate } from "react-router-dom";
import { ROLE_NAMES } from "@/constants/menu";

export default function RoleIndexRedirect() {
  let role = ROLE_NAMES.ADMINISTRADOR;
  try {
    const raw = sessionStorage.getItem("user");
    console.log("RoleIndexRedirect raw user:", raw);
    const u = raw ? JSON.parse(raw) : null;
    role =
      u?.role?.nombre || // por si alguna vez viene así
      u?.rol?.[0] || // tu JSON actual: "rol": ["evaluador"]
      u?.user?.personas?.[0]?.rols?.[0]?.nombre || // por si accedemos al nivel interno
      ROLE_NAMES.ADMINISTRADOR; // valor por defecto
    console.log("RoleIndexRedirect role:", role);
  } catch {}

  if (role === ROLE_NAMES.EVALUADOR)
    return <Navigate to="informacion-personal" replace />;
  if (role === ROLE_NAMES.RESPONSABLE_DE_AREA)
    return <Navigate to="informacion-personal" replace />;

  // por defecto admin
  return <Navigate to="panel-principal" replace />;
}
