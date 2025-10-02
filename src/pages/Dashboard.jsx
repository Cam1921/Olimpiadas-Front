// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me, logout } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  // Hidrata desde sessionStorage para evitar parpadeo
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true;
    me()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        // El interceptor 401 ya redirige; esto es fallback
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login", { replace: true });
      });
    return () => { mounted = false; };
  }, [navigate]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Nebula — Dashboard</h1>
          <button className="border rounded px-3 py-1" onClick={onLogout}>
            Cerrar sesión
          </button>
        </header>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-2">Tu perfil</h2>
        {!loading ? (
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p>Cargando...</p>
        )}
        </div>
      </div>
    </div>
  );
}
