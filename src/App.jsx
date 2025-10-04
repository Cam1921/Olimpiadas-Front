import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GestionInscripciones from "./pages/GestionarInscripciones";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GestionInscripciones />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/gestionar-inscripciones" element={<GestionInscripciones />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
