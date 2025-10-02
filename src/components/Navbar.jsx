// src/components/Navbar.jsx
import sansi from "../assets/sansi.png";

export default function Navbar() {
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

        {/* acciones futuras (login, etc.) */}
        <div />
      </div>
    </header>
  );
}
