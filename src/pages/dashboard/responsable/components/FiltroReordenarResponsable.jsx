import { useCallback } from "react";

export default function FiltroReordenarResponsable({
  query = "",
  onQueryChange = () => {},
  sort = { by: "nota", dir: "desc" }, // default HU11.2: Nota desc
  onSortChange = () => {},
  disabled = false,
}) {
  const toggle = useCallback(
    (by) => {
      const next =
        sort.by === by
          ? { by, dir: sort.dir === "asc" ? "desc" : "asc" }
          : { by, dir: by === "nota" ? "desc" : "asc" };
      onSortChange(next);
    },
    [sort, onSortChange]
  );

  const active = (by) => sort.by === by;
  const arrow = sort.dir === "asc" ? "▲" : "▼";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Buscar por nombre o CI */}
      <div className="relative w-full md:max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nombre o CI…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-sky-500 focus:outline-none"
          disabled={disabled}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          ⌕
        </span>
      </div>

      {/* Ordenar por */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordenar por:</span>

        <button
          type="button"
          onClick={() => toggle("nombre")}
          aria-pressed={active("nombre")}
          disabled={disabled}
          className={[
            "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
            active("nombre")
              ? "border-sky-500 bg-sky-50 text-sky-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            disabled && "opacity-60",
          ].join(" ")}
        >
          <span>Nombre</span>
          {active("nombre") && <span>{arrow}</span>}
        </button>

        <button
          type="button"
          onClick={() => toggle("nota")}
          aria-pressed={active("nota")}
          disabled={disabled}
          className={[
            "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
            active("nota")
              ? "border-sky-500 bg-sky-50 text-sky-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            disabled && "opacity-60",
          ].join(" ")}
        >
          <span>Nota</span>
          {active("nota") && <span>{arrow}</span>}
        </button>
      </div>
    </div>
  );
}
