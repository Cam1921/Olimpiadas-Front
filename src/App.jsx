// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PanelPrincipal from "@/pages/dashboard/panelPrincipal/administrador/PanelPrincipal";
import GestionInscripciones from "./pages/dashboard/gestionInscripciones/GestionInscripciones";
import RoleIndexRedirect from "@/pages/dashboard/RoleIndexRedirect";
import InformacionPersonal from "@/pages/dashboard/informacionPersonal/InformacionPersonal";

import TestControlFases from "./pages/TestControlFases";
import TestFlujoPublicacion from "./pages/TestFlujoPublicacion.jsx";

import ResponsablesAcademicos from "./pages/ResponsablesAcademicos";
import Evaluadores from "./pages/Evaluadores";
import EvaluadorHome from "./pages/dashboard/evaluador/pages/EvaluadorHome.jsx";
import NotificacionesPage from "@/pages/dashboard/notificaciones/NotificacionesPage";
import EstablecerContraseñaPage from "@/pages/auth/EstablecerContraseñaPage";
import EntornoFinal from "./components/EntornoFinal.jsx";
import OfficialListPage from "./components/OfficialListPage";

// 👇 NUEVO: importa la pestaña Publicación (sin acento)
import PublicacionPage from "./pages/dashboard/Publicacion";

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
        <Route index element={<RoleIndexRedirect />} />

        {/* Admin */}
        <Route path="panel-principal" element={<PanelPrincipal />} />
        <Route path="gestion-roles" element={<ResponsablesAcademicos />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="evaluadores" element={<Evaluadores />} />
        <Route path="registrar-notas" element={<EvaluadorHome />} />
        <Route path="control-fases" element={<TestControlFases />} />
        <Route path="resultados-reportes" element={<TestFlujoPublicacion />} />
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
        <Route path="informacion-personal" element={<InformacionPersonal />} />
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />

        {/* 👇 NUEVO: ruta a tu HU10 / Publicación */}
        <Route path="publicacion" element={<PublicacionPage />} />

        {/* Evaluador / Responsable (comparten la misma vista) */}
        <Route path="informacion-personal" element={<InformacionPersonal />} />

        {/* (más adelante puedes añadir:)
            <Route path="registrar-notas" element={<RegistrarNotas />} />
            <Route path="clasificacion" element={<Clasificacion />} />
            <Route path="control-fases-area" element={<ControlFasesArea />} />
            <Route path="reportes-area" element={<ReportesArea />} />
        */}

        {/* (Esta ruta ya está arriba, puedes dejar solo una si quieres) */}
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
      </Route>

      {/* Rutas de prueba (accesibles sin login) */}
      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />
      <Route path="/evaluadores-test" element={<Evaluadores />} />

      {/* 🔹 Rutas para Entorno Final y Lista Oficial (pruebas visuales) */}
      <Route path="/entorno-final" element={<EntornoFinal />} />
      <Route path="/lista-oficial" element={<OfficialListPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
