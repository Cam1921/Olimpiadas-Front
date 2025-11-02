// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PanelPrincipal from "@/pages/dashboard/panelPrincipal/administrador/PanelPrincipal";
import GestionInscripciones from "./pages/dashboard/gestionInscripciones/GestionInscripciones";
import RoleIndexRedirect from "@/pages/dashboard/RoleIndexRedirect";
import InformacionPersonal from "@/pages/dashboard/informacionPersonal/InformacionPersonal";

import ResponsablesAcademicos from "./pages/ResponsablesAcademicos";
import Evaluadores from "./pages/Evaluadores";
import EvaluadorHome from "./pages/dashboard/evaluador/pages/EvaluadorHome.jsx";
import NotificacionesPage from "@/pages/dashboard/notificaciones/NotificacionesPage";
import EstablecerContraseñaPage from "@/pages/auth/EstablecerContraseñaPage";

// HU10 – Publicación
import PublicacionPage from "./pages/dashboard/Publicacion";

// HU05 – Responsable / Control de Fases (import directo)
import ControlFasesArea from "./pages/dashboard/responsable/ControlFasesArea.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Ruta directa para probar Evaluador SIN login */}
      <Route path="/activar" element={<EstablecerContraseñaPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* index decide a dónde ir según rol */}
        <Route index element={<RoleIndexRedirect />} />

        {/* Admin */}
        <Route path="panel-principal" element={<PanelPrincipal />} />
        <Route path="gestion-roles" element={<ResponsablesAcademicos />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="evaluadores" element={<Evaluadores />} />
        <Route path="registrar-notas" element={<EvaluadorHome />} />
        <Route path="gestion-inscripciones" element={<GestionInscripciones />} />

        {/* Publicación HU10 */}
        <Route path="publicacion" element={<PublicacionPage />} />

        {/* Evaluador / Responsable */}
        <Route path="informacion-personal" element={<InformacionPersonal />} />

        {/* HU05 – Responsable / Control de Fases */}
        <Route path="responsable/control-fases" element={<ControlFasesArea />} />

        {/* 🔁 Alias para las variaciones que usa tu menú */}
        <Route path="responsable" element={<ControlFasesArea />} />
        <Route path="control-fases" element={<ControlFasesArea />} />
        <Route path="controlfases" element={<ControlFasesArea />} />
        <Route path="responsable/controlFases" element={<ControlFasesArea />} />
        <Route path="control-fases-area" element={<ControlFasesArea />} /> {/* ← ESTA ES LA QUE NECESITAS */}

        {/* Compatibilidad */}
        <Route path="gestion-inscripciones" element={<GestionInscripciones />} />
      </Route>

      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />
      <Route path="/evaluadores-test" element={<Evaluadores />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
