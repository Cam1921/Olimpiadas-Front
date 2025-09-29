Olimpiadas Front (React + Vite)

Frontend de la plataforma Olimpiadas. Este proyecto consume la API del backend (Laravel 11) y está preparado para trabajar en equipo con ramas y buenas prácticas básicas.

🧩 Tecnologías

React 18 + Vite

Tailwind CSS 3.4.x

Axios (cliente HTTP)

React Router para rutas de SPA

✅ Requisitos previos

Node.js LTS (recomendado 20.x). Funciona con 22.x, pero para equipos se sugiere LTS.

npm (viene con Node)

Git

Editor recomendado: VS Code con estas extensiones:

Tailwind CSS IntelliSense

ESLint (opcional)

Prettier (opcional)

Thunder Client o Postman (para probar APIs)

Verifica versiones:

node -v
npm -v
git --version

🚀 Inicio rápido

IMPORTANTE: asegúrate de que el backend esté corriendo en http://localhost:8000 o ajusta el .env del front.

1) Clonar e instalar
git clone <URL-del-repositorio-front>
cd <carpeta-del-repo-front>
npm install

2) Variables de entorno

Crea un archivo .env en la raíz del proyecto (junto a package.json) y define la URL del backend:

# URL base del backend (Laravel)
VITE_API_BASE=http://localhost:8000


Si el backend corre en otro puerto/host, cambia este valor.
Para Supabase/producción se usará otra URL (ver desplegar).

3) Ejecutar en desarrollo
npm run dev


Abre el enlace que muestra Vite (por defecto http://localhost:5173).

📦 Estructura del proyecto
.
├─ public/
├─ src/
│  ├─ assets/                  # imágenes, svg, etc.
│  ├─ lib/
│  │  └─ api.ts                # cliente Axios centralizado
│  ├─ pages/
│  │  ├─ HomePage.jsx          # Home inicial (consulta /api/health)
│  │  └─ AboutPage.jsx
│  ├─ App.jsx                  # layout + rutas
│  ├─ index.css                # estilos (incluye Tailwind)
│  └─ main.jsx                 # punto de entrada con BrowserRouter
├─ .env                        # variables locales (NO commitear)
├─ index.html
├─ package.json
└─ tailwind.config.cjs         # configuración de Tailwind 3.x

🔧 Configuración técnica
Tailwind 3.x

El proyecto está configurado con Tailwind 3.4.x. Asegúrate de tener:

tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};


src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }

Cliente Axios centralizado

src/lib/api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: false, // sin cookies por ahora
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response ?? err);
    return Promise.reject(err);
  }
);

Rutas y layout básico

src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


src/App.jsx

import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
          <span className="font-bold text-lg">Olimpiadas</span>
          <NavLink to="/" className="text-sm" end>Inicio</NavLink>
          <NavLink to="/about" className="text-sm">Acerca</NavLink>
        </nav>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center text-xs text-slate-500">
          © {new Date().getFullYear()} Oh! SanSi · Nebula Soft
        </div>
      </footer>
    </div>
  );
}


src/pages/HomePage.jsx

import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function HomePage() {
  const [status, setStatus] = useState("comprobando...");
  const [ok, setOk] = useState(null);

  useEffect(() => {
    api.get("/api/health")
      .then(res => {
        setOk(res.data?.ok === true);
        setStatus("Backend OK");
      })
      .catch(() => {
        setOk(false);
        setStatus("Backend NO disponible");
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bienvenido a Olimpiadas</h1>
      <p className="text-slate-700">
        Estado del backend:{" "}
        <span className={`font-medium ${ok ? "text-green-600" : "text-red-600"}`}>
          {status}
        </span>
      </p>
    </div>
  );
}


src/pages/AboutPage.jsx

export default function AboutPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Acerca del sistema</h1>
      <p className="text-slate-700">
        Sistema para apoyar la evaluación de competidores en la olimpiada Oh! SanSi.
      </p>
    </div>
  );
}

🧪 Pruebas manuales rápidas

Arranca el backend: php artisan serve (Laravel 11).

Arranca el front: npm run dev.

En la Home, debe verse el estado del backend:

Backend OK si responde GET /api/health con { ok: true }.

🛠 Scripts disponibles
npm run dev       # modo desarrollo
npm run build     # build producción
npm run preview   # previsualizar build local

📄 Licencia

Uso académico / interno del equipo Nebula Soft – Oh! SanSi.