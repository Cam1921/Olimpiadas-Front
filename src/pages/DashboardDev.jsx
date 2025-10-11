// src/pages/DashboardDev.jsx
import { Link, Outlet, useLocation } from "react-router-dom";

export default function DashboardDev() {
  const location = useLocation();

  // Función para saber si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Panel de Administración (Modo Desarrollo)
          </h1>
          <p className="text-slate-600 mt-2">
            Autenticación desactivada temporalmente
          </p>
        </header>

        {/* PESTAÑAS DINÁMICAS */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <Link
              to="/dashboard-dev/responsables"
              className={`pb-4 px-2 font-medium text-sm transition-colors ${
                isActive("/dashboard-dev/responsables") || isActive("/dashboard-dev")
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Responsables Académicos
            </Link>
            <Link
              to="/dashboard-dev/evaluadores"
              className={`pb-4 px-2 font-medium text-sm transition-colors ${
                isActive("/dashboard-dev/evaluadores")
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Evaluadores
            </Link>
          </nav>
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </div>

        {/* Footer opcional */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>💡 Este panel es temporal. En producción, se usará autenticación real.</p>
        </div>
      </div>
    </div>
  );
}