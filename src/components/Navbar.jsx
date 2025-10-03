// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import sansi from "../assets/sansi.png";

export default function Navbar({ onLoginClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={sansi}
            alt="SanSi — Olimpiadas en Ciencia y Tecnología"
            className="h-8 w-auto"
            loading="eager"
            decoding="async"
          />
          <span className="text-lg sm:text-xl font-semibold text-ink">
            Olimpiadas en Ciencia y Tecnología
          </span>
        </div>

        {/* Botón Iniciar sesión */}
        {onLoginClick ? (
          <button type="button" className="btn-login" onClick={onLoginClick}>
            Iniciar sesión
          </button>
        ) : (
          <Link to="/login" className="btn-login">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
