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

// HU10 – Publicación
import PublicacionPage from "./pages/dashboard/Publicacion";

// HU05 – Responsable / Control de Fases (import directo)
import ControlFasesArea from "./pages/dashboard/responsable/ControlFasesArea.jsx";
import HomePlanillas from "./pages/dashboard/evaluador/pages/HomePlanillas";
import HomePlanillasResponsable from "./pages/dashboard/responsable/HomePlanillasResponsable";
import PaginaPrincipal from "./components/asignar-competidores/PaginaPrincipal";
import PreviewDistribucion from "./components/asignar-competidores/PreviewDistribucion";

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
        <Route path="asignacion-competidores" element={<PaginaPrincipal/>} />//asignacion-competidores
        <Route path="asignacion-competidores/preview" element={<PreviewDistribucion />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="evaluadores" element={<Evaluadores />} />
        {/*   <Route path="registrar-notas" element={<EvaluadorHome />} /> */}
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
        {/* Publicación HU10 */}
        <Route path="publicacion" element={<PublicacionPage />} />
        {/* Evaluador / Responsable */}
        <Route path="informacion-personal" element={<InformacionPersonal />} />
        {/* HU05 – Responsable / Control de Fases */}
        <Route
          path="responsable/control-fases"
          element={<ControlFasesArea />}
        />
        {/* (Esta ruta ya está arriba, puedes dejar solo una si quieres) */}
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
        {/* 🔁 Alias para las variaciones que usa tu menú */}
        <Route path="responsable" element={<ControlFasesArea />} />
        <Route path="control-fases" element={<ControlFasesArea />} />
        <Route path="controlfases" element={<ControlFasesArea />} />
        {/*   <Route path="responsable/controlFases" element={<ControlFasesArea />} /> */}
        {/*  <Route path="control-fases-area" element={<ControlFasesArea />} />{" "} */}
        <Route path="entorno-final" element={<EntornoFinal />} />
        <Route path="registrar-notas" element={<HomePlanillas />} />
        <Route
          path="control-fases-area"
          element={<HomePlanillasResponsable />}
        />
        {/* ← ESTA ES LA QUE NECESITAS */}
        {/* Compatibilidad */}
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
      </Route>

      {/* Rutas de prueba (accesibles sin login) */}
      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />
      <Route path="/evaluadores-test" element={<Evaluadores />} />

      {/* 🔹 Rutas para Entorno Final y Lista Oficial (pruebas visuales) */}

      <Route path="/lista-oficial" element={<OfficialListPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
