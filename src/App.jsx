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
// 👇 Importa la página del evaluador en la ruta real (dentro de /pages)
import EvaluadorHome from "./pages/dashboard/evaluador/pages/EvaluadorHome.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Ruta directa para probar Evaluador SIN login */}

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
        <Route path="evaluadores" element={<Evaluadores />} />
        <Route path="registrar-notas" element={<EvaluadorHome />} />
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />

        {/* Evaluador / Responsable (comparten la misma vista) */}
        <Route path="informacion-personal" element={<InformacionPersonal />} />
        {/* (más adelante puedes añadir:)
            <Route path="registrar-notas" element={<RegistrarNotas />} />
            <Route path="clasificacion" element={<Clasificacion />} />
            <Route path="control-fases-area" element={<ControlFasesArea />} />
            <Route path="reportes-area" element={<ReportesArea />} />
        */}
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
      </Route>

      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />

      <Route path="/evaluadores-test" element={<Evaluadores />} />
  
      <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/test-control-fases" element={<TestControlFases />} />
<Route path="/test-flujo-publicacion" element={<TestFlujoPublicacion />} />

    </Routes>
  );
}
