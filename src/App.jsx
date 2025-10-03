import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ResponsablesAcademicos from "./pages/ResponsablesAcademicos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="responsables" element={<ResponsablesAcademicos />} />
      </Route>

      {/* 🔹 Ruta de prueba sin login */}
      <Route path="/responsables-test" element={<ResponsablesAcademicos />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
