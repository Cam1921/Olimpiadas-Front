// src/pages/dashboard/publicacion/components/BusquedaOrdenAdmin.jsx
import { useEffect } from "react";
import { HiMagnifyingGlass, HiArrowsUpDown } from "react-icons/hi2";

export default function BusquedaOrdenAdmin({
  query,
  onQueryChange,
  sort,
  onSortChange,
  disabled,
}) {
  const isNombre = (sort?.by || "puntaje_total") === "nombre";
  const isNota = (sort?.by || "puntaje_total") === "nota";

  const dirSymbol = (by) =>
    sort?.by === by ? (sort.dir === "asc" ? "↑" : "↓") : "";

  const toggleBy = (by) => {
    if (sort?.by === by) {
      onSortChange({ by, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      // predeterminado: nota ↓, nombre ↑
      onSortChange({ by, dir: by === "puntaje_total" ? "desc" : "asc" });
    }
  };

  const baseBtn =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition select-none";
  const active =
    "bg-[var(--primary)] text-white border-[var(--primary)] shadow";
  const inactive =
    "bg-white text-[var(--primary)] border-[var(--primary)] hover:bg-[color:rgb(var(--primary-rgb)/0.06)]";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Buscar por nombre */}
      <div className="relative w-full md:max-w-md">
        <HiMagnifyingGlass className="absolute left-3 top-2.5 opacity-60" />
        <input
          className="w-full border rounded-xl pl-10 pr-3 py-2 outline-none"
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {/* Botones azules: Nombre / Nota */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => toggleBy("nombre")}
          className={`${baseBtn} ${isNombre ? active : inactive}`}
          title={`Ordenar por nombre ${
            dirSymbol("nombre") ? (sort.dir === "asc" ? "(A–Z)" : "(Z–A)") : ""
          }`}
        >
          <HiArrowsUpDown className="opacity-90" />
          <span>Nombre</span>
          <span className="text-xs">{dirSymbol("nombre")}</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => toggleBy("puntaje_total")}
          className={`${baseBtn} ${isNota ? active : inactive}`}
          title={`Ordenar por nota ${
            dirSymbol("puntaje_total")
              ? sort.dir === "asc"
                ? "(asc)"
                : "(desc)"
              : ""
          }`}
        >
          <HiArrowsUpDown className="opacity-90" />
          <span>Nota</span>
          <span className="text-xs">{dirSymbol("puntaje_total")}</span>
        </button>
      </div>
    </div>
  );
}
