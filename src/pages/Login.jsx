import { useState } from "react";
import { login } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@nebula.com");
  const [password, setPassword] = useState("Admin12345!");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/Dashboard", { replace: true });
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Nebula — Login</h1>

        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            className="border rounded p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border rounded p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white rounded p-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
