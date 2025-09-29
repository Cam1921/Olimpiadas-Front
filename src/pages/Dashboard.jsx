import { useEffect, useState } from "react";
import { me, logout } from "../services/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    me().then(setUser).catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Nebula — Dashboard</h1>
          <button
            className="border rounded px-3 py-1"
            onClick={() => { logout(); window.location.href = "/login"; }}
          >
            Cerrar sesión
          </button>
        </header>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-2">Tu perfil</h2>
          {user ? (
            <pre className="text-sm bg-gray-50 p-3 rounded">{JSON.stringify(user, null, 2)}</pre>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}
