// src/components/SideMenu.jsx
import { NavLink } from "react-router-dom";
import { BiHome, BiCategoryAlt } from "react-icons/bi";
import { GoPeople, GoMail } from "react-icons/go";
import {
  HiOutlineUserGroup,
  HiAcademicCap,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { BsSliders2, BsPersonCheck } from "react-icons/bs";
import { GrTrophy } from "react-icons/gr";
import { FaRegFileAlt } from "react-icons/fa";
import { LuFileCheck } from "react-icons/lu";
import { ImSphere } from "react-icons/im";
import { IoTimeOutline } from "react-icons/io5";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MENU_BY_ROLE, ROLE_NAMES } from "@/constants/menu";
import { AiOutlineEdit } from "react-icons/ai";
import { CalendarCheck } from "lucide-react";

const ICONS = {
  BiHome,
  BiCategoryAlt,
  GoPeople,
  HiOutlineUserGroup,
  HiAcademicCap,
  HiOutlinePencilSquare,
  AiOutlineEdit,
  CalendarCheck,
  BsSliders2,
  BsPersonCheck,
  GrTrophy,
  FaRegFileAlt,
  LuFileCheck,
  ImSphere,
  IoTimeOutline,
  GoMail,
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
        "fixed top-0 left-0 h-full z-40 bg-white border-r flex flex-col",
        "transition-[width] duration-300 ease-out",
      ].join(" ")}
      style={{ width: open ? WIDTH_EXPANDED : WIDTH_COLLAPSED }}
      aria-expanded={open}
      aria-label="Barra lateral de navegación"
    >
      {/* Header/logo */}
      <div className="flex items-center justify-center px-3 h-[68px] border-b"></div>

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
              {Icon && (
                <Icon
                  size={20}
                  className="shrink-0 text-gray-700"
                  aria-hidden
                />
              )}
              {/* Etiqueta: solo visible cuando está abierto */}
              <span
                className={[
                  "ml-2  whitespace-nowrap overflow-hidden",
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
    </aside>
  );
}
