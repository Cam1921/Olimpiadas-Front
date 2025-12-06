import {
  ArrowDown,
  ArrowDown10,
  ArrowDownAZ,
  ArrowUp,
  ArrowUp10,
  ArrowUpAZ,
} from "lucide-react";
import { useCallback } from "react";

export default function OrdenClasificatoria({
  sort = { by: "nombre", dir: "asc" },
  onSortChange = () => {},
  disabled = false,
}) {
  const toggle = useCallback(
    (by) => {
      const next =
        sort.by === by
          ? { by, dir: sort.dir === "asc" ? "desc" : "asc" }
          : { by, dir: by === "puntaje_total" ? "desc" : "asc" };
      onSortChange(next);
    },
    [sort, onSortChange]
  );

  const active = (by) => sort.by === by;
  const getArrowIcon = () => {
    if (sort.by === "nombre") {
      return sort.dir === "asc" ? (
        <ArrowDownAZ className="w-5 h-5 inline-block ml-1" />
      ) : (
        <ArrowUpAZ className="w-5 h-5 inline-block ml-1" />
      );
    }

    if (sort.by === "puntaje_total") {
      return sort.dir === "asc" ? (
        <ArrowUp10 className="w-5 h-5  inline-block ml-1" />
      ) : (
        <ArrowDown10 className="w-5 h-5  inline-block ml-1" />
      );
    }

    return null;
  };

  return (
    <div className=" p-4 bg-white border border-[#23263D]/10 rounded-xl shadow-sm">
      <div className="text-xs text-[#23263D]/70 mb-3 text-center">
        Ordenar listado por:
      </div>

      <div className="flex justify-center gap-3">
        {/* Botón: Nombre */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => toggle("nombre")}
          className={[
            "px-4 py-1.5 rounded-lg text-sm shadow-sm transition flex items-center gap-1",
            active("nombre")
              ? "bg-[#0284C7] text-white"
              : "bg-[#F8FAFB] border border-[#23263D]/20 text-[#23263D]/80 hover:bg-[#ECEFF1]",
            disabled && "opacity-60",
          ].join(" ")}
        >
          <span>Nombre</span>
          {active("nombre") && getArrowIcon()}
        </button>

        {/* Botón: Nota */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => toggle("puntaje_total")}
          className={[
            "px-4 py-1.5 rounded-lg text-sm shadow-sm transition flex items-center gap-1",
            active("puntaje_total")
              ? "bg-[#0284C7] text-white"
              : "bg-[#F8FAFB] border border-[#23263D]/20 text-[#23263D]/80 hover:bg-[#ECEFF1]",
            disabled && "opacity-60",
          ].join(" ")}
        >
          <span>Nota</span>
          {active("puntaje_total") && getArrowIcon()}
        </button>
      </div>
    </div>
  );
}
