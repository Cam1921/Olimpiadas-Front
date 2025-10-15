// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PanelPrincipal from "@/pages/dashboard/panelPrincipal/administrador/PanelPrincipal";
import GestionInscripciones from "./pages/dashboard/gestionInscripciones/GestionInscripciones";

import ResponsablesAcademicos from "./pages/ResponsablesAcademicos";
import Evaluadores from "./pages/Evaluadores";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<PanelPrincipal />} />
        <Route path="panel-principal" element={<PanelPrincipal />} />
        <Route
          path="gestion-inscripciones"
          element={<GestionInscripciones />}
        />
        <Route path="gestion-roles" element={<ResponsablesAcademicos />} />
        <Route path="evaluadores" element={<Evaluadores />} />
      </Route>

      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />

      <Route path="/evaluadores-test" element={<Evaluadores />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
