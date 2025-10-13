// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PanelPrincipal from "@/pages/dashboard/panelPrincipal/administrador/PanelPrincipal";
import GestionInscripciones from "./pages/dashboard/gestionInscripciones/GestionInscripciones";

// 👇 Importa la página del evaluador en la ruta real (dentro de /pages)
import EvaluadorHome from "./pages/dashboard/evaluador/pages/EvaluadorHome.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Ruta directa para probar Evaluador SIN login */}
      <Route path="/evaluador" element={<EvaluadorHome />} />

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
        <Route path="gestion-inscripciones" element={<GestionInscripciones />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
