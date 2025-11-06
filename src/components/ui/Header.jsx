// src/components/ui/Header.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiSidebar,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import sansi from "@/assets/sansi.png";

// helper para leer user desde sessionStorage
function readSessionUser() {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Header(props) {
  const {
    title,
    subtitle,
    breadcrumbs = [],
    showMenu = true,
    onToggleMenu,
    showSearch = false,
    searchPlaceholder = "Buscar…",
    onSearchChange,
    right,
    showUser = true,
    onLogout,
    className = "",
  } = props;

  const [scrolled, setScrolled] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const dropdownRef = useRef(null);

  // Estado reactivo del usuario
  const [userData, setUserData] = useState(() => readSessionUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openUser) return;
    const onClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpenUser(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [openUser]);

  // Escucha cambios del usuario guardado
  useEffect(() => {
    const refresh = () => setUserData(readSessionUser());
    window.addEventListener("storage", refresh); // otros tabs
    window.addEventListener("user:updated", refresh); // mismo tab
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("user:updated", refresh);
    };
  }, []);

  // Extraer info de la nueva estructura
  const persona = userData?.user?.personas?.[0];
  const rolPersona =
    persona?.rols?.[0]?.nombre?.toLowerCase() ||
    userData?.rol?.[0]?.toLowerCase() ||
    "";

  const isAdmin = rolPersona.includes("admin");

  const displayName = useMemo(() => {
    if (!persona) return userData?.user?.name || "—";

    const nombre = persona.nombre ?? persona.nombres ?? "";
    const apellido = persona.apellido ?? persona.apellidos ?? "";

    const fullName = [nombre, apellido].filter(Boolean).join(" ").trim();
    return fullName || userData?.user?.name || "Usuario";
  }, [persona, userData]);

  const roleName = persona?.rols?.[0]?.nombre || userData?.rol?.[0] || "—";

  return (
    <header
      className={[
        "sticky top-0 z-40",
        "bg-[var(--bg)]/80 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--bg)]",
        "border-b",
        scrolled ? "shadow-sm border-gray-200" : "border-gray-100",
        "px-3 sm:px-4 lg:px-6",
        scrolled ? "py-3" : "pt-5 pb-4",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {showMenu ? (
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Abrir menú"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--grisClaro)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <FiSidebar className="h-5 w-5 text-[var(--negro)]" />
          </button>
        ) : (
          <div className="h-9 w-9" aria-hidden />
        )}

        <div className="flex-1 min-w-0">
          {breadcrumbs?.length > 0 && (
            <nav className="mb-1 text-xs text-[var(--grisOscuro)] flex items-center gap-1 flex-wrap">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {b.to ? (
                    <Link className="hover:underline" to={b.to}>
                      {b.label}
                    </Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <span className="opacity-60">/</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-end gap-3">
            <img src={sansi} alt="Sansi" className="h-9 w-auto" />
            <h1 className="text-base sm:text-lg font-semibold leading-5 text-[var(--negro)] truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs sm:text-sm text-[var(--grisOscuro)] truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {showSearch && (
          <div className="hidden md:flex items-center mr-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>
        )}

        {right ? (
          <div className="min-h-9 min-w-9 flex items-center justify-center">
            {right}
          </div>
        ) : showUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
              onClick={() => setOpenUser((s) => !s)}
            >
              <div className="h-7 w-7 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <FiUser className="text-white" />
              </div>
              <div className="hidden sm:flex flex-col items-start leading-4">
                <span className="text-xs font-semibold text-gray-900 max-w-[180px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-gray-500 max-w-[180px] truncate">
                  {roleName}
                </span>
              </div>
              <FiChevronDown className="text-gray-600" />
            </button>

            {openUser && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
                <div className="px-3 py-2 text-xs text-gray-500 border-b">
                  Sesión activa
                </div>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                  onClick={onLogout}
                >
                  <FiLogOut /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-9 w-9" aria-hidden />
        )}
      </div>
    </header>
  );
}
