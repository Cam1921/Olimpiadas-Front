// src/components/SideMenu.jsx
import { NavLink } from "react-router-dom";
import { BiHome } from "react-icons/bi"; 
import { GoPeople } from "react-icons/go"; 
import { HiOutlineUserGroup,HiAcademicCap,HiOutlinePencilSquare } from "react-icons/hi2"; 
import { BsSliders2 } from "react-icons/bs"; 
import { GrTrophy } from "react-icons/gr"; 
import { FaRegFileAlt } from "react-icons/fa"; 
import { LuFileCheck } from "react-icons/lu"; 
import { ImSphere } from "react-icons/im"; 
import { IoTimeOutline } from "react-icons/io5"; 
import { FiUser, FiLogOut } from "react-icons/fi";
import { MENU_BY_ROLE, ROLE_NAMES } from "@/constants/menu";

const ICONS = {
  BiHome,
  GoPeople,
  HiOutlineUserGroup,
  HiAcademicCap,
  HiOutlinePencilSquare,
  BsSliders2,
  GrTrophy,
  FaRegFileAlt,
  LuFileCheck,
  ImSphere,
  IoTimeOutline,
};

const WIDTH_EXPANDED = 260;
const WIDTH_COLLAPSED = 72; // rail

export default function SideMenu({
  open = true,
  role = ROLE_NAMES.ADMINISTRADOR,
  onLogout,
}) {
  const items = MENU_BY_ROLE[role] ?? [];

  return (
    <aside
      className={[
        "h-screen border-r bg-[var(--blanco)] flex flex-col",
        "transition-[width] duration-300 ease-out",
      ].join(" ")}
      style={{ width: open ? WIDTH_EXPANDED : WIDTH_COLLAPSED }}
      aria-expanded={open}
      aria-label="Barra lateral de navegación"
    >
      {/* Header/logo */}
      <div className="flex items-center justify-center px-3 h-[68px] border-b">
        {open ? (
          <img src="/assets/logo1.png" alt="Logo" width={160} height={160} />
        ) : (
          // mini logo cuando está colapsado
          <img src="/assets/logo1.png" alt="Logo" width={36} height={36} className="rounded" />
        )}
      </div>

      {/* Menú */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon ? ICONS[it.icon] : null;
          return (
            <NavLink
              key={it.path}
              to={it.path}
              title={!open ? it.label : undefined} // tooltip cuando está colapsado
              className={({ isActive }) =>
                [
                  "flex items-center rounded-md px-3 py-2 text-sm",
                  "transition-colors",
                  isActive
                    ? "bg-[#ebf4f8] text-ink font-semibold"
                    : "text-gray-800 hover:bg-gray-100",
                ].join(" ")
              }
              end
            >
              {Icon && <Icon size={20} className="shrink-0 text-gray-700" aria-hidden />}
              {/* Etiqueta: solo visible cuando está abierto */}
              <span
                className={[
                  "ml-2 whitespace-nowrap overflow-hidden",
                  "transition-all duration-200",
                  open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
                ].join(" ")}
                aria-hidden={!open}
              >
                {it.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <FiUser className="text-white" />
          </div>

          {/* nombre/rol solo cuando está abierto */}
          <div
            className={[
              "min-w-0 transition-all duration-200 overflow-hidden",
              open ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0",
            ].join(" ")}
            aria-hidden={!open}
          >
            <p className="text-sm font-bold text-gray-900 truncate">
              {sessionStorage.getItem("user")
                ? JSON.parse(sessionStorage.getItem("user")).nombre ?? "Usuario"
                : "Usuario"}
            </p>
            <p className="text-[11px] font-semibold text-gray-500 uppercase truncate">
              {role?.toString?.() ?? "rol"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className={[
            "w-full inline-flex items-center gap-2 text-xs font-semibold",
            "text-gray-700 hover:bg-[var(--grisClaro)] h-9 rounded-xl px-3",
            open ? "justify-start" : "justify-center",
          ].join(" ")}
          title={!open ? "Cerrar sesión" : undefined}
        >
          <FiLogOut className="h-4 w-4" />
          <span className={open ? "inline" : "hidden"}>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
