// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PanelPrincipal from "@/pages/dashboard/panelPrincipal/administrador/PanelPrincipal";
import GestionInscripciones from "./pages/dashboard/gestionInscripciones/GestionInscripciones";

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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
